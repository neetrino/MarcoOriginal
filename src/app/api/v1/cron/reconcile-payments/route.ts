import { NextResponse } from "next/server";

import { and, eq, lt, isNotNull } from "drizzle-orm";

import { getEnv } from "@/config/env";
import { getDb } from "@/db/client";
import { orders, payments } from "@/db/schema";
import { logger } from "@/lib/observability/logger";
import { getArcaOrderStatus } from "@/lib/payments/arca/client";
import { resolveArcaPaymentOutcome } from "@/lib/payments/arca/types";
import {
  completeOnlinePayment,
  failOnlinePayment,
} from "@/lib/payments/complete-payment";

const DEFAULT_PENDING_TIMEOUT_MINUTES = 60;
const MAX_BATCH = 50;

function authorizeCron(request: Request): boolean {
  const secret = getEnv().CRON_SECRET;
  if (!secret) {
    return process.env.NODE_ENV !== "production";
  }
  const header = request.headers.get("authorization");
  return header === `Bearer ${secret}`;
}

function pendingTimeoutMs(): number {
  const raw = getEnv().PAYMENT_PENDING_TIMEOUT_MINUTES;
  const minutes = raw ? Number.parseInt(raw, 10) : DEFAULT_PENDING_TIMEOUT_MINUTES;
  const safe = Number.isFinite(minutes) && minutes > 0
    ? minutes
    : DEFAULT_PENDING_TIMEOUT_MINUTES;
  return safe * 60_000;
}

/**
 * Reconciles pending ArCa payments when the browser returnUrl never arrived.
 * Secure with CRON_SECRET (Vercel cron Authorization bearer).
 */
export async function GET(request: Request): Promise<Response> {
  if (!authorizeCron(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cutoff = new Date(Date.now() - pendingTimeoutMs());
  const db = getDb();

  const pending = await db
    .select({
      orderId: orders.id,
      orderNumber: orders.orderNumber,
      paymentId: payments.id,
      providerReference: payments.providerReference,
      createdAt: payments.createdAt,
    })
    .from(payments)
    .innerJoin(orders, eq(orders.id, payments.orderId))
    .where(
      and(
        eq(payments.provider, "arca"),
        eq(payments.status, "PENDING"),
        eq(orders.paymentStatus, "PENDING"),
        isNotNull(payments.providerReference),
        lt(payments.createdAt, cutoff),
      ),
    )
    .limit(MAX_BATCH);

  let captured = 0;
  let failed = 0;
  let skipped = 0;

  for (const row of pending) {
    const providerRef = row.providerReference;
    if (!providerRef) {
      skipped += 1;
      continue;
    }

    try {
      const status = await getArcaOrderStatus(providerRef);
      const outcome = resolveArcaPaymentOutcome(status);

      if (outcome === "captured") {
        await completeOnlinePayment({
          orderId: row.orderId,
          provider: "arca",
          providerReference: providerRef,
          providerEventId: `arca:${providerRef}:reconcile-deposited`,
          source: "reconcile",
        });
        captured += 1;
        continue;
      }

      if (outcome === "failed") {
        await failOnlinePayment({
          orderId: row.orderId,
          provider: "arca",
          providerReference: providerRef,
          providerEventId: `arca:${providerRef}:reconcile-failed`,
          source: "reconcile",
        });
        failed += 1;
        continue;
      }

      skipped += 1;
    } catch (error) {
      logger.error("arca_reconcile_item_failed", {
        orderNumber: row.orderNumber,
        message: error instanceof Error ? error.message : "unknown",
      });
      skipped += 1;
    }
  }

  return NextResponse.json({
    checked: pending.length,
    captured,
    failed,
    skipped,
  });
}
