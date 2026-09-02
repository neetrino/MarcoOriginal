import { NextResponse } from "next/server";

import { eq } from "drizzle-orm";

import { getDb } from "@/db/client";
import { orders, payments } from "@/db/schema";
import { getEnv } from "@/config/env";
import { logger } from "@/lib/observability/logger";
import { getArcaOrderStatus } from "@/lib/payments/arca/client";
import { resolveArcaPaymentOutcome } from "@/lib/payments/arca/types";
import {
  completeOnlinePayment,
  failOnlinePayment,
} from "@/lib/payments/complete-payment";

function appBaseUrl(): string {
  return getEnv().NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
}

function redirectTo(
  locale: string,
  path: string,
): NextResponse {
  return NextResponse.redirect(`${appBaseUrl()}/${locale}${path}`);
}

/**
 * ArCa browser returnUrl handler.
 * Always verifies status via getOrderStatusExtended.do — never trusts query alone.
 */
export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const orderId = url.searchParams.get("order");
  const arcaOrderId =
    url.searchParams.get("orderId") ?? url.searchParams.get("mdOrder");

  if (!orderId) {
    return redirectTo("hy", "/checkout?payment=failed");
  }

  const db = getDb();
  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1);

  if (!order) {
    return redirectTo("hy", "/checkout?payment=failed");
  }

  const locale = order.locale || "hy";

  const [payment] = await db
    .select()
    .from(payments)
    .where(eq(payments.orderId, order.id))
    .limit(1);

  const providerOrderId = arcaOrderId ?? payment?.providerReference;
  if (!providerOrderId) {
    logger.warn("arca_callback_missing_provider_ref", {
      orderNumber: order.orderNumber,
    });
    return redirectTo(locale, "/checkout?payment=failed");
  }

  try {
    const status = await getArcaOrderStatus(providerOrderId);
    const outcome = resolveArcaPaymentOutcome(status);

    if (outcome === "captured") {
      const completed = await completeOnlinePayment({
        orderId: order.id,
        provider: "arca",
        providerReference: providerOrderId,
        providerEventId: `arca:${providerOrderId}:deposited`,
        source: "callback",
      });
      if (completed.ok) {
        return redirectTo(
          completed.locale || locale,
          `/checkout/success/${completed.orderNumber}`,
        );
      }
    }

    if (outcome === "failed") {
      await failOnlinePayment({
        orderId: order.id,
        provider: "arca",
        providerReference: providerOrderId,
        providerEventId: `arca:${providerOrderId}:failed`,
        source: "callback",
      });
      return redirectTo(locale, "/checkout?payment=failed");
    }

    // Still pending (user closed 3DS early, etc.)
    return redirectTo(locale, "/checkout?payment=pending");
  } catch (error) {
    logger.error("arca_callback_error", {
      orderNumber: order.orderNumber,
      message: error instanceof Error ? error.message : "unknown",
    });
    return redirectTo(locale, "/checkout?payment=failed");
  }
}
