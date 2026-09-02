import { Check, Package, ShoppingBag } from "lucide-react";

import { AppLink } from "@/components/ui/AppLink";
import {
  CHECKOUT_SUCCESS_ACCENT_BAR_CLASS,
  CHECKOUT_SUCCESS_CARD_CLASS,
  CHECKOUT_SUCCESS_ICON_WRAP_CLASS,
  CHECKOUT_SUCCESS_META_CLASS,
  CHECKOUT_SUCCESS_ORDER_BADGE_CLASS,
  CHECKOUT_SUCCESS_PAGE_CLASS,
  CHECKOUT_SUCCESS_PRIMARY_ACTION_CLASS,
  CHECKOUT_SUCCESS_SECONDARY_ACTION_CLASS,
} from "@/features/checkout/ui/checkout-section-classes";

type CheckoutSuccessViewProps = {
  locale: string;
  orderNumber: string;
  totalFormatted: string;
  showOrdersLink: boolean;
  labels: {
    title: string;
    body: string;
    total: string;
    continueShopping: string;
    viewOrders: string;
  };
};

export function CheckoutSuccessView({
  locale,
  orderNumber,
  totalFormatted,
  showOrdersLink,
  labels,
}: CheckoutSuccessViewProps) {
  const [bodyBefore = "", bodyAfter = ""] = labels.body.split("{orderNumber}");
  const totalLabel = labels.total.replace("{amount}", totalFormatted);

  return (
    <section className={CHECKOUT_SUCCESS_PAGE_CLASS}>
      <div className={CHECKOUT_SUCCESS_CARD_CLASS}>
        <div className={CHECKOUT_SUCCESS_ACCENT_BAR_CLASS} aria-hidden />

        <div className={CHECKOUT_SUCCESS_ICON_WRAP_CLASS}>
          <Check className="h-8 w-8 stroke-[2.5]" aria-hidden />
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-marco-slate sm:text-3xl">
          {labels.title}
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-marco-slate/75 sm:text-base">
          {bodyBefore}
          <span className={CHECKOUT_SUCCESS_ORDER_BADGE_CLASS}>
            {orderNumber}
          </span>
          {bodyAfter}
        </p>

        <div className={CHECKOUT_SUCCESS_META_CLASS}>
          <p className="text-xs font-semibold uppercase tracking-wider text-marco-slate/55">
            {totalLabel}
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <AppLink
            href={`/${locale}/products`}
            prefetchPolicy="intent"
            className={CHECKOUT_SUCCESS_PRIMARY_ACTION_CLASS}
          >
            <ShoppingBag className="h-4 w-4 shrink-0" aria-hidden />
            {labels.continueShopping}
          </AppLink>
          {showOrdersLink ? (
            <AppLink
              href={`/${locale}/profile/orders`}
              prefetchPolicy="intent"
              className={CHECKOUT_SUCCESS_SECONDARY_ACTION_CLASS}
            >
              <Package className="h-4 w-4 shrink-0" aria-hidden />
              {labels.viewOrders}
            </AppLink>
          ) : null}
        </div>
      </div>
    </section>
  );
}
