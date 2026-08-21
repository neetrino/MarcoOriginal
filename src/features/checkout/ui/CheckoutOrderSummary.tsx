"use client";

import { AppLink } from "@/components/ui/AppLink";
import {
  CHECKOUT_PRIMARY_BUTTON_CLASS,
  CHECKOUT_PROMO_APPLY_CLASS,
  CHECKOUT_PROMO_INPUT_CLASS,
  CHECKOUT_SECONDARY_BUTTON_CLASS,
} from "@/features/checkout/ui/checkout-section-classes";

type CheckoutOrderSummaryProps = {
  title: string;
  couponTitle: string;
  couponPlaceholder: string;
  couponApplyLabel: string;
  couponApplyingLabel: string;
  discountLabel: string;
  subtotalLabel: string;
  shippingLabel: string;
  totalLabel: string;
  subtotalFormatted: string;
  shippingFormatted: string;
  discountFormatted: string | null;
  totalFormatted: string;
  couponDraft: string;
  onCouponDraftChange: (value: string) => void;
  onApplyCoupon: () => void;
  couponError: string | null;
  isApplyingCoupon: boolean;
  error: string | null;
  isSubmitting: boolean;
  placeOrderLabel: string;
  processingLabel: string;
  continueShoppingHref: string;
  continueShoppingLabel: string;
};

function SummaryRow({
  label,
  value,
  valueClassName = "font-medium text-marco-ink",
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="text-marco-slate/70">{label}</span>
      <span className={`tabular-nums ${valueClassName}`}>{value}</span>
    </div>
  );
}

export function CheckoutOrderSummary({
  title,
  couponTitle,
  couponPlaceholder,
  couponApplyLabel,
  couponApplyingLabel,
  discountLabel,
  subtotalLabel,
  shippingLabel,
  totalLabel,
  subtotalFormatted,
  shippingFormatted,
  discountFormatted,
  totalFormatted,
  couponDraft,
  onCouponDraftChange,
  onApplyCoupon,
  couponError,
  isApplyingCoupon,
  error,
  isSubmitting,
  placeOrderLabel,
  processingLabel,
  continueShoppingHref,
  continueShoppingLabel,
}: CheckoutOrderSummaryProps) {
  return (
    <div className="lg:col-span-1">
      <div className="pb-5 lg:sticky lg:top-28">
        <div className="checkout-order-summary-receipt-shell">
          <div className="cart-order-summary-receipt">
            <h2 className="mb-5 text-xl font-semibold text-marco-slate">{title}</h2>

            <div className="mb-5">
              <label
                htmlFor="checkout-promo-code"
                className="mb-1 block text-sm font-medium text-marco-ink"
              >
                {couponTitle}
              </label>
              <div className="flex gap-2">
                <input
                  id="checkout-promo-code"
                  type="text"
                  name="couponCodeDraft"
                  value={couponDraft}
                  onChange={(event) =>
                    onCouponDraftChange(event.target.value.toUpperCase())
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      onApplyCoupon();
                    }
                  }}
                  placeholder={couponPlaceholder}
                  autoComplete="off"
                  disabled={isSubmitting || isApplyingCoupon}
                  className={CHECKOUT_PROMO_INPUT_CLASS}
                />
                <button
                  type="button"
                  onClick={onApplyCoupon}
                  disabled={
                    isSubmitting || isApplyingCoupon || !couponDraft.trim()
                  }
                  className={CHECKOUT_PROMO_APPLY_CLASS}
                >
                  {isApplyingCoupon ? couponApplyingLabel : couponApplyLabel}
                </button>
              </div>
              {couponError ? (
                <p className="mt-2 text-sm text-red-600" role="alert">
                  {couponError}
                </p>
              ) : null}
            </div>

            <div className="space-y-3">
              <SummaryRow label={subtotalLabel} value={subtotalFormatted} />
              {discountFormatted ? (
                <SummaryRow
                  label={discountLabel}
                  value={`-${discountFormatted}`}
                  valueClassName="font-medium text-emerald-700"
                />
              ) : null}
              <SummaryRow label={shippingLabel} value={shippingFormatted} />
            </div>

            <div className="mt-4 border-t border-gray-200/80 pt-4">
              <div className="flex items-center justify-between gap-3 text-base font-bold text-marco-ink">
                <span>{totalLabel}</span>
                <span className="tabular-nums">{totalFormatted}</span>
              </div>
            </div>

            {error ? (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            ) : null}

            <div className="mt-5 space-y-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className={CHECKOUT_PRIMARY_BUTTON_CLASS}
              >
                {isSubmitting ? processingLabel : placeOrderLabel}
              </button>
              <AppLink
                href={continueShoppingHref}
                prefetchPolicy="intent"
                className={CHECKOUT_SECONDARY_BUTTON_CLASS}
              >
                {continueShoppingLabel}
              </AppLink>
            </div>
          </div>
          <div className="cart-order-summary-receipt-edge" aria-hidden />
        </div>
      </div>
    </div>
  );
}
