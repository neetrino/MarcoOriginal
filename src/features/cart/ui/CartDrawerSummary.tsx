import { AppLink } from "@/components/ui/AppLink";
import {
  CART_DRAWER_CHECKOUT_CLASS,
  CART_DRAWER_SUMMARY_CLASS,
  CART_DRAWER_SUMMARY_TITLE_CLASS,
} from "@/features/cart/ui/cart-drawer.classes";

type CartDrawerSummaryProps = {
  checkoutHref: string;
  orderSummaryLabel: string;
  subtotalLabel: string;
  shippingLabel: string;
  shippingValue: string;
  totalLabel: string;
  subtotalFormatted: string;
  totalFormatted: string;
  checkoutLabel: string;
  onCheckout: () => void;
};

export function CartDrawerSummary({
  checkoutHref,
  orderSummaryLabel,
  subtotalLabel,
  shippingLabel,
  shippingValue,
  totalLabel,
  subtotalFormatted,
  totalFormatted,
  checkoutLabel,
  onCheckout,
}: CartDrawerSummaryProps) {
  return (
    <div className={CART_DRAWER_SUMMARY_CLASS}>
      <h3 className={CART_DRAWER_SUMMARY_TITLE_CLASS}>{orderSummaryLabel}</h3>
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between gap-3">
          <span className="text-marco-slate/70">{subtotalLabel}</span>
          <span className="font-medium text-marco-ink">{subtotalFormatted}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-marco-slate/70">{shippingLabel}</span>
          <span className="font-medium text-marco-ink">{shippingValue}</span>
        </div>
      </div>
      <div className="mt-3 border-t border-gray-200/80 pt-3">
        <div className="flex items-center justify-between gap-3 text-base font-bold text-marco-ink">
          <span>{totalLabel}</span>
          <span className="tabular-nums">{totalFormatted}</span>
        </div>
      </div>
      <AppLink
        href={checkoutHref}
        prefetchPolicy="intent"
        onClick={onCheckout}
        className={CART_DRAWER_CHECKOUT_CLASS}
      >
        {checkoutLabel}
      </AppLink>
    </div>
  );
}
