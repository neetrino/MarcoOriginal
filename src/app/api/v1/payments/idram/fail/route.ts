import { NextResponse } from "next/server";

import { eq } from "drizzle-orm";

import { getEnv } from "@/config/env";
import { getDb } from "@/db/client";
import { orders } from "@/db/schema";

function appBaseUrl(): string {
  return getEnv().NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
}

/** Idram FAIL_URL — browser redirect when payment is declined or cancelled. */
export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const orderNumber =
    url.searchParams.get("order_number") ??
    url.searchParams.get("EDP_BILL_NO") ??
    url.searchParams.get("order");

  let locale = "hy";
  if (orderNumber) {
    const [order] = await getDb()
      .select({ locale: orders.locale })
      .from(orders)
      .where(eq(orders.orderNumber, orderNumber))
      .limit(1);
    if (order?.locale) {
      locale = order.locale;
    }
  }

  return NextResponse.redirect(
    `${appBaseUrl()}/${locale}/checkout?payment=failed`,
  );
}
