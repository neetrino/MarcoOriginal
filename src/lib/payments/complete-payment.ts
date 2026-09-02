import "server-only";

import { and, eq } from "drizzle-orm";

import { cartItems, carts, orderEvents, orders, payments } from "@/db/schema";
import { withTransaction } from "@/db/transaction";
import { revalidateCartPaths } from "@/features/cart/cart";
import { createId } from "@/lib/id";
import { logger } from "@/lib/observability/logger";

export type CompleteOnlinePaymentInput = {
  orderId: string;
  provider: "arca" | "idram";
  providerReference: string;
  providerEventId: string;
  source: "callback" | "reconcile" | "success";
};

export type CompleteOnlinePaymentResult =
  | { ok: true; alreadyComplete: boolean; orderNumber: string; locale: string }
  | { ok: false; reason: "NOT_FOUND" | "WRONG_PROVIDER" };

/**
 * Marks order/payment CAPTURED idempotently, clears checkout cart by metadata cartId.
 */
export async function completeOnlinePayment(
  input: CompleteOnlinePaymentInput,
): Promise<CompleteOnlinePaymentResult> {
  const result = await withTransaction(async (tx) => {
    const [order] = await tx
      .select()
      .from(orders)
      .where(eq(orders.id, input.orderId))
      .for("update")
      .limit(1);

    if (!order) {
      return { ok: false as const, reason: "NOT_FOUND" as const };
    }

    const [payment] = await tx
      .select()
      .from(payments)
      .where(
        and(
          eq(payments.orderId, order.id),
          eq(payments.provider, input.provider),
        ),
      )
      .limit(1);

    if (!payment) {
      return { ok: false as const, reason: "WRONG_PROVIDER" as const };
    }

    if (order.paymentStatus === "CAPTURED" && payment.status === "CAPTURED") {
      return {
        ok: true as const,
        alreadyComplete: true,
        orderNumber: order.orderNumber,
        locale: order.locale,
      };
    }

    const now = new Date();
    const cartId =
      typeof payment.metadata?.cartId === "string"
        ? payment.metadata.cartId
        : null;

    await tx
      .update(orders)
      .set({
        paymentStatus: "CAPTURED",
        status: order.status === "PENDING" ? "CONFIRMED" : order.status,
        updatedAt: now,
      })
      .where(eq(orders.id, order.id));

    await tx
      .update(payments)
      .set({
        status: "CAPTURED",
        providerReference: input.providerReference,
        updatedAt: now,
        metadata: {
          ...(payment.metadata ?? {}),
          completedVia: input.source,
        },
      })
      .where(eq(payments.id, payment.id));

    await tx.insert(orderEvents).values({
      id: createId(),
      orderId: order.id,
      eventType: "PAYMENT_PROVIDER",
      fromState: order.paymentStatus,
      toState: "CAPTURED",
      isCustomerVisible: true,
      providerEventId: input.providerEventId,
      correlationId: createId(),
      payload: {
        source: input.source,
        provider: input.provider,
        providerReference: input.providerReference,
      },
    });

    if (cartId) {
      await tx.delete(cartItems).where(eq(cartItems.cartId, cartId));
      await tx
        .update(carts)
        .set({ status: "CONVERTED", updatedAt: now })
        .where(eq(carts.id, cartId));
    }

    return {
      ok: true as const,
      alreadyComplete: false,
      orderNumber: order.orderNumber,
      locale: order.locale,
      clearedCart: Boolean(cartId),
    };
  });

  if (!result.ok) {
    return result;
  }

  if (!result.alreadyComplete && "clearedCart" in result && result.clearedCart) {
    await revalidateCartPaths();
  }

  logger.info("online_payment_captured", {
    orderNumber: result.orderNumber,
    provider: input.provider,
    source: input.source,
  });

  return {
    ok: true,
    alreadyComplete: result.alreadyComplete,
    orderNumber: result.orderNumber,
    locale: result.locale,
  };
}

/** Marks online payment failed without touching cart. */
export async function failOnlinePayment(input: {
  orderId: string;
  provider: "arca" | "idram";
  providerReference?: string | null;
  providerEventId: string;
  source: "callback" | "reconcile";
}): Promise<void> {
  await withTransaction(async (tx) => {
    const [order] = await tx
      .select()
      .from(orders)
      .where(eq(orders.id, input.orderId))
      .for("update")
      .limit(1);

    if (
      !order ||
      order.paymentStatus === "CAPTURED" ||
      order.paymentStatus === "FAILED"
    ) {
      return;
    }

    const [payment] = await tx
      .select()
      .from(payments)
      .where(
        and(
          eq(payments.orderId, order.id),
          eq(payments.provider, input.provider),
        ),
      )
      .limit(1);

    if (!payment || payment.status === "CAPTURED") {
      return;
    }

    const now = new Date();
    await tx
      .update(orders)
      .set({ paymentStatus: "FAILED", updatedAt: now })
      .where(eq(orders.id, order.id));

    await tx
      .update(payments)
      .set({
        status: "FAILED",
        providerReference: input.providerReference ?? payment.providerReference,
        updatedAt: now,
      })
      .where(eq(payments.id, payment.id));

    await tx.insert(orderEvents).values({
      id: createId(),
      orderId: order.id,
      eventType: "PAYMENT_PROVIDER",
      fromState: order.paymentStatus,
      toState: "FAILED",
      isCustomerVisible: true,
      providerEventId: input.providerEventId,
      payload: {
        source: input.source,
        provider: input.provider,
      },
    });
  });
}
