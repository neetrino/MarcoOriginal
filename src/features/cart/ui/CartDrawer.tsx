"use client";

import { useState, useTransition } from "react";
import { X } from "lucide-react";

import { SideSheet } from "@/components/ui/SideSheet";
import { removeItem, updateQuantity } from "@/features/cart/cart";
import type { CartDrawerView } from "@/features/cart/get-cart-drawer-view";
import { loadCartDrawerViewAction } from "@/features/cart/load-cart-drawer-view-action";
import { HeaderCartButton } from "@/features/cart/ui/HeaderCartButton";
import {
  CART_DRAWER_CLOSE_CLASS,
  CART_DRAWER_COUNT_CLASS,
  CART_DRAWER_HEADER_CLASS,
  CART_DRAWER_PANEL_CLASS,
  CART_DRAWER_SURFACE_CLASS,
  CART_DRAWER_TITLE_CLASS,
} from "@/features/cart/ui/cart-drawer.classes";
import { CartDrawerEmpty } from "@/features/cart/ui/CartDrawerEmpty";
import { CartDrawerItemRow } from "@/features/cart/ui/CartDrawerItemRow";
import { CartDrawerSummary } from "@/features/cart/ui/CartDrawerSummary";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import type { Currency } from "@/lib/money/currency";
import { formatMoneyWithSymbol } from "@/lib/money/format";

type CartDrawerTriggerArgs = {
  open: boolean;
  badgeCount: number;
  label: string;
  openDrawer: () => void;
  prefetchDrawerView: () => void;
};

type CartDrawerProps = {
  locale: Locale;
  currency: Currency;
  dictionary: Dictionary;
  itemCount: number;
  cartTotalFormatted?: string;
  renderTrigger?: (args: CartDrawerTriggerArgs) => React.ReactNode;
};

function formatItemCount(
  count: number,
  labels: Dictionary["cartDrawer"],
): string {
  if (count === 1) {
    return labels.itemsOne;
  }
  return labels.itemsMany.replace("{count}", String(count));
}

export function CartDrawer({
  locale,
  currency,
  dictionary,
  itemCount,
  cartTotalFormatted,
  renderTrigger,
}: CartDrawerProps) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<CartDrawerView | null>(null);
  const [loadingView, setLoadingView] = useState(false);
  const [pending, startTransition] = useTransition();
  const labels = dictionary.cartDrawer;
  const closedTotal =
    cartTotalFormatted ?? formatMoneyWithSymbol(0, currency, locale);
  const badgeCount = open && view != null ? view.itemCount : itemCount;
  const totalLabel =
    open && view != null ? view.headerTotalFormatted : closedTotal;
  const hasItems = Boolean(view && view.items.length > 0);

  function loadDrawerView(): void {
    setLoadingView(true);
    startTransition(async () => {
      const next = await loadCartDrawerViewAction(locale, currency);
      setView(next);
      setLoadingView(false);
    });
  }

  function prefetchDrawerView(): void {
    if (view || loadingView || open) {
      return;
    }
    loadDrawerView();
  }

  function openDrawer(): void {
    setOpen(true);
    loadDrawerView();
  }

  function closeDrawer(): void {
    setOpen(false);
  }

  function changeQuantity(itemId: string, quantity: number): void {
    startTransition(async () => {
      await updateQuantity(itemId, quantity);
      setView(await loadCartDrawerViewAction(locale, currency));
    });
  }

  function removeCartItem(itemId: string): void {
    startTransition(async () => {
      await removeItem(itemId);
      setView(await loadCartDrawerViewAction(locale, currency));
    });
  }

  return (
    <>
      <SideSheet
        open={open}
        onClose={closeDrawer}
        ariaLabel={labels.title}
        panelClassName={CART_DRAWER_PANEL_CLASS}
        surfaceClassName={CART_DRAWER_SURFACE_CLASS}
        closeVariant="none"
        zIndexClassName="z-[260]"
        backdropBlur
      >
        <header className={CART_DRAWER_HEADER_CLASS}>
          <h2 className={CART_DRAWER_TITLE_CLASS}>
            {labels.title}
            {hasItems ? (
              <span className={CART_DRAWER_COUNT_CLASS}>
                ({formatItemCount(badgeCount, labels)})
              </span>
            ) : null}
          </h2>
          <button
            type="button"
            onClick={closeDrawer}
            className={CART_DRAWER_CLOSE_CLASS}
            aria-label={labels.close}
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </header>

        <div
          className={`flex min-h-0 flex-1 flex-col ${
            pending || loadingView ? "opacity-70" : ""
          }`}
        >
          {loadingView && !view ? (
            <div className="flex flex-1 items-center justify-center px-4 py-10">
              <p className="text-sm text-marco-slate/70">{labels.loading}</p>
            </div>
          ) : !view || view.items.length === 0 ? (
            <CartDrawerEmpty
              emptyLabel={labels.empty}
              actionHref={`/${locale}/products`}
              actionLabel={labels.emptyCta}
              onAction={closeDrawer}
            />
          ) : (
            <>
              <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
                <div className="space-y-3">
                  {view.items.map((item) => (
                    <CartDrawerItemRow
                      key={item.id}
                      item={item}
                      pending={pending}
                      removeLabel={labels.removeItem}
                      decreaseLabel={labels.decreaseQuantity}
                      increaseLabel={labels.increaseQuantity}
                      onRemove={removeCartItem}
                      onUpdateQuantity={changeQuantity}
                      onNavigate={closeDrawer}
                    />
                  ))}
                </div>
              </div>
              <CartDrawerSummary
                checkoutHref={`/${locale}/checkout`}
                orderSummaryLabel={labels.orderSummary}
                subtotalLabel={labels.subtotal}
                shippingLabel={labels.shipping}
                shippingValue={labels.shippingNotCalculated}
                totalLabel={labels.total}
                subtotalFormatted={view.subtotalFormatted}
                totalFormatted={view.totalFormatted}
                checkoutLabel={labels.checkout}
                onCheckout={closeDrawer}
              />
            </>
          )}
        </div>
      </SideSheet>

      {renderTrigger ? (
        renderTrigger({
          open,
          badgeCount,
          label: dictionary.nav.cart,
          openDrawer,
          prefetchDrawerView,
        })
      ) : (
        <HeaderCartButton
          open={open}
          badgeCount={badgeCount}
          totalLabel={totalLabel}
          label={dictionary.nav.cart}
          openDrawer={openDrawer}
          prefetchDrawerView={prefetchDrawerView}
        />
      )}
    </>
  );
}
