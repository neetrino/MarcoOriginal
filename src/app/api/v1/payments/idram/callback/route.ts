import { NextResponse } from "next/server";

import { and, eq } from "drizzle-orm";

import { getDb } from "@/db/client";
import { orders, payments } from "@/db/schema";
import { logger } from "@/lib/observability/logger";
import {
  completeOnlinePayment,
} from "@/lib/payments/complete-payment";
import { getIdramConfig } from "@/lib/payments/idram/config";
import { verifyIdramChecksum } from "@/lib/payments/idram/checksum";
import { idramAmountsMatch } from "@/lib/payments/idram/amounts";
import { defaultCurrency } from "@/lib/money/currency";

function plainText(body: string, status = 200): Response {
  return new NextResponse(body, {
    status,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

function readField(
  params: URLSearchParams,
  key: string,
): string {
  return (params.get(key) ?? "").trim();
}

/**
 * Idram RESULT_URL — two POSTs: precheck (EDP_PRECHECK=YES) then payment confirm.
 * Responses must be plain text exactly "OK" on success.
 */
export async function POST(request: Request): Promise<Response> {
  const raw = await request.text();
  const params = new URLSearchParams(raw);

  const billNo = readField(params, "EDP_BILL_NO");
  const recAccount = readField(params, "EDP_REC_ACCOUNT");
  const amount = readField(params, "EDP_AMOUNT");
  const isPrecheck = readField(params, "EDP_PRECHECK").toUpperCase() === "YES";

  if (!billNo || !recAccount || !amount) {
    return plainText("Missing required fields", 400);
  }

  let config;
  try {
    config = getIdramConfig();
  } catch {
    return plainText("Merchant not configured", 500);
  }

  if (recAccount !== config.recAccount) {
    return plainText("EDP_REC_ACCOUNT mismatch", 400);
  }

  const db = getDb();
  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.orderNumber, billNo))
    .limit(1);

  if (!order) {
    return plainText("EDP_BILL_NO not found", 400);
  }

  const [payment] = await db
    .select()
    .from(payments)
    .where(
      and(eq(payments.orderId, order.id), eq(payments.provider, "idram")),
    )
    .limit(1);

  if (!payment) {
    return plainText("Payment not found", 400);
  }

  if (!idramAmountsMatch(amount, order.totalAmount, defaultCurrency)) {
    return plainText("EDP_AMOUNT mismatch", 400);
  }

  if (isPrecheck) {
    if (order.paymentStatus !== "PENDING" && order.paymentStatus !== "CAPTURED") {
      return plainText("Order not payable", 400);
    }
    return plainText("OK");
  }

  const payerAccount = readField(params, "EDP_PAYER_ACCOUNT");
  const transId = readField(params, "EDP_TRANS_ID");
  const transDate = readField(params, "EDP_TRANS_DATE");
  const checksum = readField(params, "EDP_CHECKSUM");

  if (!payerAccount || !transId || !transDate || !checksum) {
    return plainText("Missing confirmation fields", 400);
  }

  const checksumOk = verifyIdramChecksum(
    {
      recAccount,
      amount,
      secretKey: config.secretKey,
      billNo,
      payerAccount,
      transId,
      transDate,
    },
    checksum,
  );

  if (!checksumOk) {
    logger.warn("idram_checksum_failed", { orderNumber: order.orderNumber });
    return plainText("EDP_CHECKSUM not correct", 400);
  }

  if (order.paymentStatus === "CAPTURED") {
    return plainText("OK");
  }

  const completed = await completeOnlinePayment({
    orderId: order.id,
    provider: "idram",
    providerReference: transId,
    providerEventId: `idram:${transId}`,
    source: "callback",
  });

  if (!completed.ok) {
    return plainText("Unable to complete payment", 500);
  }

  return plainText("OK");
}
