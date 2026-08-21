import { ShoppingCart } from "lucide-react";

import { AppLink } from "@/components/ui/AppLink";
import {
  CART_DRAWER_EMPTY_ACTION_CLASS,
  CART_DRAWER_EMPTY_CLASS,
  CART_DRAWER_EMPTY_ICON_CLASS,
  CART_DRAWER_EMPTY_TEXT_CLASS,
} from "@/features/cart/ui/cart-drawer.classes";

type CartDrawerEmptyProps = {
  emptyLabel: string;
  actionHref: string;
  actionLabel: string;
  onAction: () => void;
};

export function CartDrawerEmpty({
  emptyLabel,
  actionHref,
  actionLabel,
  onAction,
}: CartDrawerEmptyProps) {
  return (
    <div className={CART_DRAWER_EMPTY_CLASS}>
      <div className={CART_DRAWER_EMPTY_ICON_CLASS} aria-hidden>
        <ShoppingCart className="h-[72px] w-[72px]" strokeWidth={1.5} />
      </div>
      <p className={CART_DRAWER_EMPTY_TEXT_CLASS}>{emptyLabel}</p>
      <AppLink
        href={actionHref}
        prefetchPolicy="intent"
        onClick={onAction}
        className={CART_DRAWER_EMPTY_ACTION_CLASS}
      >
        {actionLabel}
      </AppLink>
    </div>
  );
}
