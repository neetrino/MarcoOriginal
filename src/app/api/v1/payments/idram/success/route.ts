import { NextResponse } from "next/server";

import { eq } from "drizzle-orm";

import { getEnv } from "@/config/env";
import { getDb } from "@/db/client";
import { orders } from "@/db/schema";

function appBaseUrl(): string {
  return getEnv().NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
}

/** Idram SUCCESS_URL — browser redirect after wallet payment. */
export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const orderNumber =
    url.searchParams.get("order_number") ??
    url.searchParams.get("EDP_BILL_NO") ??
    url.searchParams.get("order");

  if (!orderNumber) {
    return NextResponse.redirect(`${appBaseUrl()}/hy/checkout?payment=failed`);
  }

  const [order] = await getDb()
    .select({
      orderNumber: orders.orderNumber,
      locale: orders.locale,
      paymentStatus: orders.paymentStatus,
    })
    .from(orders)
    .where(eq(orders.orderNumber, orderNumber))
    .limit(1);

  const locale = order?.locale || "hy";

  if (!order) {
    return NextResponse.redirect(
      `${appBaseUrl()}/${locale}/checkout?payment=failed`,
    );
  }

  if (order.paymentStatus === "CAPTURED") {
    return NextResponse.redirect(
      `${appBaseUrl()}/${locale}/checkout/success/${order.orderNumber}`,
    );
  }

  // Callback may still be in flight — send user to success page; status shows pending/paid.
  return NextResponse.redirect(
    `${appBaseUrl()}/${locale}/checkout/success/${order.orderNumber}`,
  );
}
