"use server";

import { createHash } from "node:crypto";

import { and, eq, sql } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getEnv } from "@/config/env";
import { getProviders } from "@/config/providers";
import { getDb } from "@/db/client";
import {
  cartItems,
  carts,
  deliveryRules,
  orderEvents,
  orderItems,
  orders,
  payments,
  products,
  promotions,
  stockMovements,
} from "@/db/schema";
import { withTransaction } from "@/db/transaction";
import {
  getCartWithItems,
  revalidateCartPaths,
} from "@/features/cart/cart";
import {
  checkoutSchema,
  type CheckoutInput,
} from "@/features/checkout/schemas";
import { toPaymentRecord } from "@/features/checkout/domain/payment-methods";
import {
  ORDER_NUMBER_LOCK_KEY,
  formatOrderNumber,
  nextOrderSequence,
} from "@/features/orders/domain/order-number";
import {
  couponDiscountErrorMessage,
  evaluateCouponDiscount,
} from "@/features/promotions/domain/evaluate-coupon";
import { normalizePromotionCode } from "@/features/promotions/domain/promotion-rules";
import { restockIfAtThreshold } from "@/features/products/domain/product-stock";
import { resolveProductPrices } from "@/features/promotions/application/resolve-product-prices";
import { getCurrentUser } from "@/lib/auth/session";
import { getCheckoutRateSnapshot } from "@/lib/fx/service";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { createId } from "@/lib/id";
import { convertAmount } from "@/lib/money/convert";
import { defaultCurrency } from "@/lib/money/currency";
import {
  CURRENCY_COOKIE_NAME,
  parseCurrencyCookie,
} from "@/lib/money/currency-cookie";
import { logger } from "@/lib/observability/logger";
import { isArcaConfigured } from "@/lib/payments/arca/config";
import { registerArcaOrder } from "@/lib/payments/arca/client";
import { isIdramConfigured } from "@/lib/payments/idram/config";

function hashValue(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function deliveryLabel(countryCode: string, city: string | null): string {
  const cityPart = city?.trim();
  if (cityPart) {
    return `${cityPart}, ${countryCode}`;
  }
  return countryCode;
}

export type CreateOrderResult =
  | { ok: true; orderNumber: string }
  | { ok: false; error: string };

/** Creates an order; COD returns success, online methods redirect to the provider. */
export async function createOrderAction(
  raw: CheckoutInput,
): Promise<CreateOrderResult> {
  const parsed = checkoutSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "Invalid checkout data." };
  }

  const input = parsed.data;
  if (input.paymentMethod === "arca" && !isArcaConfigured()) {
    return { ok: false, error: "Card payment is temporarily unavailable." };
  }
  if (input.paymentMethod === "idram" && !isIdramConfigured()) {
    return { ok: false, error: "Idram is temporarily unavailable." };
  }

  const user = await getCurrentUser();
  const { cart, items } = await getCartWithItems();
  const cookieStore = await cookies();
  const displayCurrency = parseCurrencyCookie(
    cookieStore.get(CURRENCY_COOKIE_NAME)?.value,
  );

  if (items.length === 0 || !cart) {
    return { ok: false, error: "Cart is empty." };
  }

  let rateSnapshot;
  try {
    rateSnapshot = await getCheckoutRateSnapshot(displayCurrency);
  } catch {
    return { ok: false, error: "Exchange rate unavailable. Try again shortly." };
  }

  const contactName = `${input.firstName} ${input.lastName}`.trim();
  const scopeHash = hashValue(user?.id ?? cart.guestTokenHash ?? cart.id);
  const keyHash = hashValue(input.idempotencyKey);
  const fingerprint = hashValue(
    JSON.stringify({
      cartId: cart.id,
      items: items.map(({ item }) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      email: input.contactEmail.toLowerCase(),
      shippingMethod: input.shippingMethod,
      paymentMethod: input.paymentMethod,
      deliveryRuleId: input.deliveryRuleId ?? null,
    }),
  );

  const isOnline =
    input.paymentMethod === "arca" || input.paymentMethod === "idram";

  let created: {
    orderId: string;
    orderNumber: string;
    totalAmount: number;
    paymentId: string | null;
    locale: string;
    paymentStatus: string;
    reused: boolean;
  };

  try {
    created = await withTransaction(async (tx) => {
      const [existing] = await tx
        .select({
          id: orders.id,
          orderNumber: orders.orderNumber,
          totalAmount: orders.totalAmount,
          locale: orders.locale,
          paymentStatus: orders.paymentStatus,
        })
        .from(orders)
        .where(
          and(
            eq(orders.idempotencyScopeHash, scopeHash),
            eq(orders.idempotencyKeyHash, keyHash),
            eq(orders.requestFingerprint, fingerprint),
          ),
        )
        .limit(1);

      if (existing) {
        const [existingPayment] = await tx
          .select({ id: payments.id })
          .from(payments)
          .where(eq(payments.orderId, existing.id))
          .limit(1);
        return {
          orderId: existing.id,
          orderNumber: existing.orderNumber,
          totalAmount: existing.totalAmount,
          paymentId: existingPayment?.id ?? null,
          locale: existing.locale,
          paymentStatus: existing.paymentStatus,
          reused: true as const,
        };
      }

      let delivery: typeof deliveryRules.$inferSelect | null = null;
      if (input.shippingMethod === "delivery") {
        if (!input.deliveryRuleId) {
          throw new Error("Delivery location is required.");
        }

        const [matched] = await tx
          .select()
          .from(deliveryRules)
          .where(
            and(
              eq(deliveryRules.id, input.deliveryRuleId),
              eq(deliveryRules.isActive, true),
            ),
          )
          .limit(1);

        if (!matched) {
          throw new Error("Selected delivery location is unavailable.");
        }

        delivery = matched;
      }

      const address = {
        recipientFirstName: input.firstName,
        recipientLastName: input.lastName,
        phone: input.contactPhone,
        countryCode: delivery?.countryCode ?? "AM",
        region: input.region,
        city:
          input.shippingMethod === "pickup"
            ? (input.city?.trim() || "Yerevan")
            : (delivery?.city?.trim() || input.city?.trim() || ""),
        line1:
          input.shippingMethod === "pickup"
            ? (input.line1?.trim() || "Store pickup")
            : (input.line1 ?? ""),
        line2: input.line2,
        postalCode: input.postalCode,
      };

      let subtotal = 0;
      const lineSnapshots: Array<{
        productId: string;
        title: string;
        sku: string;
        quantity: number;
        unitAmount: number;
        unitDisplayAmount: number;
        compareAtAmount: number | null;
        lineDiscountAmount: number;
        lineTotal: number;
        soldStock: number;
        nextStock: number;
      }> = [];

      const lockedProducts: Array<{
        product: typeof products.$inferSelect;
        quantity: number;
      }> = [];

      for (const { item, product } of items) {
        if (product.status !== "ACTIVE") {
          throw new Error("A product in the cart is unavailable.");
        }

        const [locked] = await tx
          .select()
          .from(products)
          .where(eq(products.id, product.id))
          .for("update")
          .limit(1);

        if (!locked || locked.stockOnHand < item.quantity) {
          throw new Error("Insufficient stock for one or more items.");
        }

        lockedProducts.push({ product: locked, quantity: item.quantity });
      }

      const pricedUnits = await resolveProductPrices(
        lockedProducts.map(({ product }) => ({
          id: product.id,
          priceAmount: product.priceAmount,
          compareAtAmount: product.compareAtAmount,
        })),
      );

      for (const { product: locked, quantity } of lockedProducts) {
        const resolved = pricedUnits.get(locked.id);
        const unitAmount = resolved?.unitAmount ?? locked.priceAmount;
        const compareAtAmount = resolved?.compareAtAmount ?? null;
        const lineDiscountAmount = Math.max(
          0,
          (resolved?.listAmount ?? locked.priceAmount) - unitAmount,
        );
        const lineTotal = unitAmount * quantity;
        const unitDisplayAmount = Number(
          convertAmount(
            unitAmount,
            rateSnapshot.rate,
            defaultCurrency,
            displayCurrency,
          ).amount,
        );
        subtotal += lineTotal;
        lineSnapshots.push({
          productId: locked.id,
          title:
            locked.translations.en?.title ??
            locked.translations.hy?.title ??
            locked.sku,
          sku: locked.sku,
          quantity,
          unitAmount,
          unitDisplayAmount,
          compareAtAmount,
          lineDiscountAmount,
          lineTotal,
          soldStock: locked.stockOnHand - quantity,
          nextStock: restockIfAtThreshold(locked.stockOnHand - quantity),
        });
      }

      const deliveryAmount =
        input.shippingMethod === "pickup"
          ? 0
          : delivery &&
              (delivery.freeThresholdAmount === null ||
                subtotal < delivery.freeThresholdAmount)
            ? delivery.priceAmount
            : 0;

      let discountAmount = 0;
      let appliedPromotion: typeof promotions.$inferSelect | null = null;
      if (input.couponCode) {
        const code = normalizePromotionCode(input.couponCode);
        const [coupon] = await tx
          .select()
          .from(promotions)
          .where(
            and(eq(promotions.kind, "COUPON"), eq(promotions.code, code)),
          )
          .for("update")
          .limit(1);

        const nowCheck = new Date();
        const evaluated = evaluateCouponDiscount(coupon, subtotal, nowCheck);
        if (!evaluated.ok || !coupon) {
          throw new Error(
            couponDiscountErrorMessage(
              evaluated.ok ? "INVALID_OR_INACTIVE" : evaluated.error,
            ),
          );
        }

        discountAmount = evaluated.discountAmount;
        appliedPromotion = coupon;

        await tx
          .update(promotions)
          .set({
            usedCount: sql`${promotions.usedCount} + 1`,
            updatedAt: nowCheck,
          })
          .where(eq(promotions.id, coupon.id));
      }

      const totalAmount = Math.max(0, subtotal - discountAmount) + deliveryAmount;
      const orderId = createId();
      await tx.execute(
        sql`select pg_advisory_xact_lock(${ORDER_NUMBER_LOCK_KEY})`,
      );
      const [maxRow] = await tx
        .select({
          maxSeq: sql<number | null>`max(cast(substring(${orders.orderNumber} from 2) as integer))`,
        })
        .from(orders)
        .where(sql`${orders.orderNumber} ~ '^p[0-9]+$'`);
      const number = formatOrderNumber(nextOrderSequence(maxRow?.maxSeq ?? null));
      const now = new Date();

      await tx.insert(orders).values({
        id: orderId,
        orderNumber: number,
        userId: user?.id,
        contactEmail: input.contactEmail.toLowerCase(),
        contactPhone: input.contactPhone,
        contactName,
        status: "PENDING",
        paymentStatus: "PENDING",
        baseCurrency: defaultCurrency,
        displayCurrency,
        exchangeRate: rateSnapshot.rate,
        exchangeRateSource: rateSnapshot.source,
        exchangeRateAsOf: rateSnapshot.asOf,
        subtotalAmount: subtotal,
        discountAmount,
        taxAmount: 0,
        deliveryAmount,
        totalAmount,
        shippingAddress: address,
        billingAddress: address,
        promotionId: appliedPromotion?.id,
        promotionCodeSnapshot: appliedPromotion?.code ?? null,
        promotionTypeSnapshot: appliedPromotion?.discountType ?? null,
        promotionValueSnapshot: appliedPromotion?.discountValue ?? null,
        promotionDiscountAmount: appliedPromotion ? discountAmount : null,
        deliveryRuleId:
          input.shippingMethod === "delivery" ? (delivery?.id ?? null) : null,
        deliveryLabelSnapshot:
          input.shippingMethod === "pickup"
            ? "Store pickup"
            : delivery
              ? deliveryLabel(delivery.countryCode, delivery.city)
              : "Delivery",
        deliveryEstimateSnapshot:
          input.shippingMethod === "pickup"
            ? null
            : delivery
              ? `${delivery.estimatedDaysMin ?? 1}-${delivery.estimatedDaysMax ?? 3} days`
              : null,
        idempotencyScopeHash: scopeHash,
        idempotencyKeyHash: keyHash,
        requestFingerprint: fingerprint,
        locale: input.locale,
        placedAt: now,
      });

      for (const line of lineSnapshots) {
        await tx.insert(orderItems).values({
          id: createId(),
          orderId,
          productId: line.productId,
          productTitleSnapshot: line.title,
          productSkuSnapshot: line.sku,
          quantity: line.quantity,
          unitBaseAmount: line.unitAmount,
          unitDisplayAmount: line.unitDisplayAmount,
          compareAtAmount: line.compareAtAmount,
          discountAmount: line.lineDiscountAmount * line.quantity,
          lineTotalAmount: line.lineTotal,
          currency: defaultCurrency,
        });

        await tx
          .update(products)
          .set({
            stockOnHand: line.nextStock,
            version: sql`${products.version} + 1`,
            updatedAt: now,
          })
          .where(eq(products.id, line.productId));

        await tx.insert(stockMovements).values({
          id: createId(),
          productId: line.productId,
          delta: -line.quantity,
          reason: "ORDER",
          orderId,
          resultingBalance: line.soldStock,
          correlationId: number,
        });

        if (line.nextStock !== line.soldStock) {
          await tx.insert(stockMovements).values({
            id: createId(),
            productId: line.productId,
            delta: line.nextStock - line.soldStock,
            reason: "ADMIN_ADJUSTMENT",
            orderId,
            resultingBalance: line.nextStock,
            correlationId: number,
          });
        }
      }

      const paymentRecord = toPaymentRecord(input.paymentMethod);
      const paymentId = createId();
      let providerReference: string | null = null;

      if (!isOnline) {
        const payment = await getProviders().payment.createPayment({
          orderId,
          amount: BigInt(totalAmount),
          currency: defaultCurrency,
          idempotencyKey: input.idempotencyKey,
        });
        providerReference = payment.providerReference;
      }

      await tx.insert(payments).values({
        id: paymentId,
        orderId,
        provider: paymentRecord.provider,
        method: paymentRecord.method,
        providerReference,
        amount: totalAmount,
        currency: defaultCurrency,
        status: "PENDING",
        attemptNumber: 1,
        metadata: isOnline ? { cartId: cart.id } : null,
      });

      await tx.insert(orderEvents).values({
        id: createId(),
        orderId,
        eventType: "STATUS_CHANGE",
        fromState: null,
        toState: "PENDING",
        actorUserId: user?.id,
        isCustomerVisible: true,
        payload: { source: "checkout" },
      });

      if (!isOnline) {
        await tx.delete(cartItems).where(eq(cartItems.cartId, cart.id));
        await tx
          .update(carts)
          .set({ status: "CONVERTED", updatedAt: now })
          .where(eq(carts.id, cart.id));
      }

      return {
        orderId,
        orderNumber: number,
        totalAmount,
        paymentId,
        locale: input.locale,
        paymentStatus: "PENDING" as const,
        reused: false as const,
      };
    });
  } catch (error) {
    logger.error("create_order_failed", {
      message: error instanceof Error ? error.message : "unknown",
      paymentMethod: input.paymentMethod,
    });
    const message =
      error instanceof Error ? error.message : "Unable to place order.";
    return { ok: false, error: message };
  }

  if (!isOnline) {
    await revalidateCartPaths();
    return {
      ok: true,
      orderNumber: created.orderNumber,
    };
  }

  if (created.paymentStatus === "CAPTURED") {
    redirect(`/${input.locale}/checkout/success/${created.orderNumber}`);
  }

  const locale: Locale = isLocale(created.locale)
    ? created.locale
    : input.locale;
  const appUrl = getEnv().NEXT_PUBLIC_APP_URL.replace(/\/$/, "");

  if (input.paymentMethod === "arca") {
    let formUrl: string;
    try {
      const registered = await registerArcaOrder({
        orderNumber: created.orderNumber,
        amountMinor: created.totalAmount,
        currency: defaultCurrency,
        returnUrl: `${appUrl}/api/v1/payments/arca/callback?order=${created.orderId}`,
        description: `Order ${created.orderNumber}`,
        language: locale,
      });

      if (created.paymentId) {
        await getDb()
          .update(payments)
          .set({
            providerReference: registered.providerOrderId,
            updatedAt: new Date(),
          })
          .where(eq(payments.id, created.paymentId));
      }

      formUrl = registered.formUrl;
    } catch (error) {
      logger.error("arca_init_failed", {
        orderNumber: created.orderNumber,
        message: error instanceof Error ? error.message : "unknown",
      });
      return {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Card payment failed to start.",
      };
    }

    redirect(formUrl);
  }

  // Idram: intermediate page auto-POSTs to GetPayment (avoids SA refresh race).
  redirect(`/${locale}/checkout/pay/${created.orderNumber}`);
}
