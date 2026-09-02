"use client";

import { useRouter } from "next/navigation";
import { useMemo, useRef, useState, useTransition, type FormEvent } from "react";

import { AppLink } from "@/components/ui/AppLink";
import { previewCouponAction } from "@/features/checkout/application/preview-coupon";
import { createOrderAction } from "@/features/checkout/create-order";
import type { CheckoutPaymentMethod } from "@/features/checkout/domain/payment-methods";
import {
  CheckoutDetailsSections,
  type CheckoutPickupBranch,
} from "@/features/checkout/ui/CheckoutDetailsSections";
import type { CheckoutLabels } from "@/features/checkout/ui/checkout-form-labels";
import type { CheckoutOrderProduct } from "@/features/checkout/ui/checkout-order-product";
import { CheckoutOrderSummary } from "@/features/checkout/ui/CheckoutOrderSummary";
import { CheckoutProductsInOrder } from "@/features/checkout/ui/CheckoutProductsInOrder";
import {
  CHECKOUT_CARD_CLASS,
  CHECKOUT_EMPTY_ACTION_CLASS,
  CHECKOUT_LAYOUT_CLASS,
  CHECKOUT_PAGE_CLASS,
  CHECKOUT_TITLE_CLASS,
} from "@/features/checkout/ui/checkout-section-classes";
import type { CheckoutDeliveryOption } from "@/features/delivery/application/queries";
import type { Locale } from "@/lib/i18n/config";
import { formatMoneyAmount } from "@/lib/money/format";

type CheckoutFormProps = {
  locale: Locale;
  labels: CheckoutLabels;
  productsHref: string;
  pickupBranches: CheckoutPickupBranch[];
  defaultFirstName: string;
  defaultLastName: string;
  defaultEmail: string;
  defaultPhone: string;
  defaultLine1: string;
  subtotalAmount: number;
  deliveryOptions: CheckoutDeliveryOption[];
  orderProducts: CheckoutOrderProduct[];
  hasItems: boolean;
};

function quoteDeliveryAmount(
  option: CheckoutDeliveryOption | undefined,
  subtotalAmount: number,
): number {
  if (!option) return 0;
  if (
    option.freeThresholdAmount !== null &&
    subtotalAmount >= option.freeThresholdAmount
  ) {
    return 0;
  }
  return option.priceAmount;
}

export function CheckoutForm({
  locale,
  labels,
  productsHref,
  pickupBranches,
  defaultFirstName,
  defaultLastName,
  defaultEmail,
  defaultPhone,
  defaultLine1,
  subtotalAmount,
  deliveryOptions,
  orderProducts,
  hasItems,
}: CheckoutFormProps) {
  const router = useRouter();
  const idempotencyKeyRef = useRef<string | null>(null);
  const defaultRuleId = deliveryOptions[0]?.id ?? "";
  const [shippingMethod, setShippingMethod] = useState<"pickup" | "delivery">(
    deliveryOptions.length > 0 ? "delivery" : "pickup",
  );
  const [deliveryRuleId, setDeliveryRuleId] = useState(defaultRuleId);
  const [paymentMethod, setPaymentMethod] =
    useState<CheckoutPaymentMethod>("cash_on_delivery");
  const [pickupBranchId, setPickupBranchId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [couponDraft, setCouponDraft] = useState("");
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(
    null,
  );
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [applyingCoupon, startApplyCoupon] = useTransition();

  const selectedDelivery = deliveryOptions.find(
    (option) => option.id === deliveryRuleId,
  );

  const paymentOptions = useMemo(
    () => [
      {
        id: "cash_on_delivery" as const,
        name: labels.cashOnDelivery,
        description: labels.cashOnDeliveryDescription,
      },
      {
        id: "idram" as const,
        name: labels.idram,
        description: labels.idramDescription,
      },
      {
        id: "arca" as const,
        name: labels.card,
        description: labels.cardDescription,
      },
    ],
    [
      labels.card,
      labels.cardDescription,
      labels.cashOnDelivery,
      labels.cashOnDeliveryDescription,
      labels.idram,
      labels.idramDescription,
    ],
  );

  function onShippingMethodChange(method: "pickup" | "delivery"): void {
    setShippingMethod(method);
    setError(null);
    if (method === "delivery") {
      setPickupBranchId("");
    }
  }

  function formatMoney(amount: number): string {
    return formatMoneyAmount(amount, "AMD", locale);
  }

  const quotedDelivery = quoteDeliveryAmount(selectedDelivery, subtotalAmount);
  const shippingAmount = shippingMethod === "pickup" ? 0 : quotedDelivery;
  const totalAmount =
    Math.max(0, subtotalAmount - discountAmount) + shippingAmount;

  const shippingFormatted =
    shippingMethod === "pickup"
      ? labels.freePickup
      : selectedDelivery
        ? `${formatMoney(shippingAmount)} (${selectedDelivery.label})`
        : labels.selectDeliveryLocation;

  function clearAppliedCoupon(): void {
    setAppliedCouponCode(null);
    setDiscountAmount(0);
  }

  function onCouponDraftChange(value: string): void {
    setCouponDraft(value);
    setCouponError(null);
    if (appliedCouponCode) {
      clearAppliedCoupon();
    }
  }

  function onApplyCoupon(): void {
    const code = couponDraft.trim();
    if (!code) {
      return;
    }

    setCouponError(null);
    startApplyCoupon(async () => {
      const result = await previewCouponAction({ couponCode: code });
      if (!result.ok) {
        clearAppliedCoupon();
        setCouponError(result.error);
        return;
      }

      setAppliedCouponCode(result.code);
      setCouponDraft(result.code);
      setDiscountAmount(result.discountAmount);
      setCouponError(null);
    });
  }

  if (!hasItems) {
    return (
      <div className={CHECKOUT_PAGE_CLASS}>
        <h1 className={CHECKOUT_TITLE_CLASS}>{labels.title}</h1>
        <div className={`${CHECKOUT_CARD_CLASS} text-center`}>
          <p className="mb-4 text-marco-slate">{labels.cartEmpty}</p>
          <AppLink
            href={productsHref}
            prefetchPolicy="intent"
            className={CHECKOUT_EMPTY_ACTION_CLASS}
          >
            {labels.continueShopping}
          </AppLink>
        </div>
      </div>
    );
  }

  function onSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setError(null);

    const selectedBranch = pickupBranches.find(
      (branch) => branch.id === pickupBranchId,
    );
    if (shippingMethod === "pickup" && !selectedBranch) {
      setError(labels.branchRequired);
      return;
    }

    startTransition(async () => {
      const result = await createOrderAction({
        locale,
        idempotencyKey:
          idempotencyKeyRef.current ??
          (idempotencyKeyRef.current = crypto.randomUUID()),
        firstName: String(data.get("firstName") ?? ""),
        lastName: String(data.get("lastName") ?? ""),
        contactEmail: String(data.get("contactEmail") ?? ""),
        contactPhone: String(data.get("contactPhone") ?? ""),
        shippingMethod,
        paymentMethod,
        deliveryRuleId:
          shippingMethod === "delivery" ? deliveryRuleId || undefined : undefined,
        city:
          shippingMethod === "delivery"
            ? selectedDelivery?.city
            : undefined,
        line1:
          shippingMethod === "delivery"
            ? String(data.get("line1") ?? "")
            : selectedBranch?.label,
        couponCode: appliedCouponCode ?? undefined,
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      router.push(`/${locale}/checkout/success/${result.orderNumber}`);
      router.refresh();
    });
  }

  return (
    <div className={CHECKOUT_PAGE_CLASS}>
      <h1 className={CHECKOUT_TITLE_CLASS}>{labels.title}</h1>

      <CheckoutProductsInOrder
        products={orderProducts}
        title={labels.productsInOrder}
        itemsOneLabel={labels.itemsOne}
        itemsManyLabel={labels.itemsMany}
        removeItemLabel={labels.removeItem}
      />

      <form onSubmit={onSubmit}>
        <div className={CHECKOUT_LAYOUT_CLASS}>
          <CheckoutDetailsSections
            labels={labels}
            pending={pending}
            shippingMethod={shippingMethod}
            onShippingMethodChange={onShippingMethodChange}
            pickupBranches={pickupBranches}
            pickupBranchId={pickupBranchId}
            onPickupBranchChange={setPickupBranchId}
            deliveryOptions={deliveryOptions}
            deliveryRuleId={deliveryRuleId}
            onDeliveryRuleChange={setDeliveryRuleId}
            paymentMethod={paymentMethod}
            onPaymentMethodChange={setPaymentMethod}
            paymentOptions={paymentOptions}
            defaultFirstName={defaultFirstName}
            defaultLastName={defaultLastName}
            defaultEmail={defaultEmail}
            defaultPhone={defaultPhone}
            defaultLine1={defaultLine1}
          />

          <CheckoutOrderSummary
            title={labels.orderSummary}
            couponTitle={labels.couponTitle}
            couponPlaceholder={labels.couponPlaceholder}
            couponApplyLabel={labels.couponApply}
            couponApplyingLabel={labels.couponApplying}
            discountLabel={labels.discount}
            subtotalLabel={labels.subtotal}
            shippingLabel={labels.shipping}
            totalLabel={labels.total}
            subtotalFormatted={formatMoney(subtotalAmount)}
            shippingFormatted={shippingFormatted}
            discountFormatted={
              discountAmount > 0 ? formatMoney(discountAmount) : null
            }
            totalFormatted={formatMoney(totalAmount)}
            couponDraft={couponDraft}
            onCouponDraftChange={onCouponDraftChange}
            onApplyCoupon={onApplyCoupon}
            couponError={couponError}
            isApplyingCoupon={applyingCoupon}
            error={error}
            isSubmitting={pending}
            placeOrderLabel={labels.placeOrder}
            processingLabel={labels.processing}
            continueShoppingHref={productsHref}
            continueShoppingLabel={labels.browseProducts}
          />
        </div>
      </form>
    </div>
  );
}
