import Image from "next/image";
import { Trash2 } from "lucide-react";

import { AppLink } from "@/components/ui/AppLink";
import type { CartDrawerItemView } from "@/features/cart/get-cart-drawer-view";
import {
  CART_DRAWER_ITEM_CLASS,
  CART_DRAWER_QTY_BUTTON_CLASS,
  CART_DRAWER_REMOVE_CLASS,
} from "@/features/cart/ui/cart-drawer.classes";

type CartDrawerItemRowProps = {
  item: CartDrawerItemView;
  pending: boolean;
  removeLabel: string;
  decreaseLabel: string;
  increaseLabel: string;
  onRemove: (itemId: string) => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onNavigate: () => void;
};

export function CartDrawerItemRow({
  item,
  pending,
  removeLabel,
  decreaseLabel,
  increaseLabel,
  onRemove,
  onUpdateQuantity,
  onNavigate,
}: CartDrawerItemRowProps) {
  const image = (
    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-marco-gray">
      {item.imageUrl ? (
        <Image
          src={item.imageUrl}
          alt={item.title}
          fill
          sizes="80px"
          className="object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
          —
        </div>
      )}
    </div>
  );

  return (
    <article className={CART_DRAWER_ITEM_CLASS}>
      <button
        type="button"
        onClick={() => onRemove(item.id)}
        disabled={pending}
        className={CART_DRAWER_REMOVE_CLASS}
        aria-label={removeLabel}
      >
        <Trash2 className="h-4 w-4" aria-hidden />
      </button>

      <div className="flex gap-3 pr-11">
        {item.productHref ? (
          <AppLink
            href={item.productHref}
            prefetchPolicy="intent"
            onClick={onNavigate}
            className="shrink-0"
          >
            {image}
          </AppLink>
        ) : (
          image
        )}

        <div className="min-w-0 flex-1">
          {item.productHref ? (
            <AppLink
              href={item.productHref}
              prefetchPolicy="intent"
              onClick={onNavigate}
              className="line-clamp-2 text-sm font-semibold text-marco-slate hover:opacity-80"
            >
              {item.title}
            </AppLink>
          ) : (
            <p className="line-clamp-2 text-sm font-semibold text-marco-slate">
              {item.title}
            </p>
          )}

          <div className="mt-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                disabled={pending}
                className={CART_DRAWER_QTY_BUTTON_CLASS}
                aria-label={decreaseLabel}
              >
                <span aria-hidden>−</span>
              </button>
              <span className="min-w-6 text-center text-sm font-semibold tabular-nums text-marco-ink">
                {item.quantity}
              </span>
              <button
                type="button"
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                disabled={pending}
                className={CART_DRAWER_QTY_BUTTON_CLASS}
                aria-label={increaseLabel}
              >
                <span aria-hidden>+</span>
              </button>
            </div>
            <span className="text-base font-bold tabular-nums text-marco-ink">
              {item.lineTotalFormatted}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
