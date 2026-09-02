import { notFound, redirect } from "next/navigation";

import { and, eq } from "drizzle-orm";

import { getDb } from "@/db/client";
import { orders, payments } from "@/db/schema";
import { AutoPostForm } from "@/features/checkout/ui/AutoPostForm";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { defaultCurrency } from "@/lib/money/currency";
import { isIdramConfigured } from "@/lib/payments/idram/config";
import { buildIdramPaymentForm } from "@/lib/payments/idram/form";

type CheckoutPayPageProps = {
  params: Promise<{ locale: string; orderNumber: string }>;
};

/**
 * Intermediate page that auto-POSTs to Idram GetPayment.
 * Avoids the Server Action → client form.submit() race with Next.js refresh.
 */
export default async function CheckoutPayPage({
  params,
}: CheckoutPayPageProps) {
  const { locale: rawLocale, orderNumber } = await params;
  if (!isLocale(rawLocale)) {
    notFound();
  }

  if (!isIdramConfigured()) {
    redirect(`/${rawLocale}/checkout?payment=failed`);
  }

  const db = getDb();
  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.orderNumber, orderNumber))
    .limit(1);

  if (!order) {
    notFound();
  }

  if (order.paymentStatus === "CAPTURED") {
    redirect(`/${rawLocale}/checkout/success/${order.orderNumber}`);
  }

  const [payment] = await db
    .select()
    .from(payments)
    .where(
      and(eq(payments.orderId, order.id), eq(payments.provider, "idram")),
    )
    .limit(1);

  if (!payment || payment.status === "FAILED") {
    redirect(`/${rawLocale}/checkout?payment=failed`);
  }

  if (order.baseCurrency !== defaultCurrency) {
    redirect(`/${rawLocale}/checkout?payment=failed`);
  }

  const form = buildIdramPaymentForm({
    orderNumber: order.orderNumber,
    amountMinor: order.totalAmount,
    currency: defaultCurrency,
    description: `Order ${order.orderNumber}`,
    locale: rawLocale,
    email: order.contactEmail,
  });

  const dictionary = getDictionary(rawLocale);

  return (
    <AutoPostForm
      action={form.action}
      fields={form.fields}
      pendingLabel={dictionary.checkout.buttons.processing}
    />
  );
}
