"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useTransition } from "react";
import { X } from "lucide-react";

import { removeItem } from "@/features/cart/cart";
import type { CheckoutOrderProduct } from "@/features/checkout/ui/checkout-order-product";
import {
  CHECKOUT_PRODUCT_CARD_CLASS,
  CHECKOUT_PRODUCT_QTY_CLASS,
  CHECKOUT_PRODUCT_REMOVE_CLASS,
  CHECKOUT_PRODUCTS_COUNT_CLASS,
  CHECKOUT_PRODUCTS_HEADER_CLASS,
  CHECKOUT_PRODUCTS_LIST_CLASS,
  CHECKOUT_PRODUCTS_SECTION_CLASS,
  CHECKOUT_PRODUCTS_TITLE_CLASS,
} from "@/features/checkout/ui/checkout-section-classes";
import { useSyncedState } from "@/lib/react/sync-state-from-prop";

type CheckoutProductsInOrderProps = {
  products: CheckoutOrderProduct[];
  title: string;
  itemsOneLabel: string;
  itemsManyLabel: string;
  removeItemLabel: string;
};

function formatItemCount(
  count: number,
  itemsOneLabel: string,
  itemsManyLabel: string,
): string {
  if (count === 1) {
    return itemsOneLabel;
  }
  return itemsManyLabel.replace("{count}", String(count));
}

export function CheckoutProductsInOrder({
  products: initialProducts,
  title,
  itemsOneLabel,
  itemsManyLabel,
  removeItemLabel,
}: CheckoutProductsInOrderProps) {
  const router = useRouter();
  const [products, setProducts] = useSyncedState(initialProducts);
  const [pending, startTransition] = useTransition();
  const scrollerRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const element = scrollerRef.current;
    if (!element) return;

    function onWheel(event: WheelEvent): void {
      if (!element) return;
      if (element.scrollWidth <= element.clientWidth) return;
      const delta =
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
          ? event.deltaX
          : event.deltaY;
      if (delta === 0) return;
      const next = Math.min(
        element.scrollWidth - element.clientWidth,
        Math.max(0, element.scrollLeft + delta),
      );
      if (next !== element.scrollLeft) {
        event.preventDefault();
        element.scrollLeft = next;
      }
    }

    element.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      element.removeEventListener("wheel", onWheel);
    };
  }, [products.length]);

  const itemCount = products.reduce((sum, product) => sum + product.quantity, 0);

  if (products.length === 0) {
    return null;
  }

  function onRemove(itemId: string): void {
    setProducts((current) => current.filter((product) => product.id !== itemId));

    startTransition(async () => {
      await removeItem(itemId);
      router.refresh();
    });
  }

  return (
    <section
      className={CHECKOUT_PRODUCTS_SECTION_CLASS}
      aria-labelledby="checkout-order-items-preview-title"
    >
      <div className={CHECKOUT_PRODUCTS_HEADER_CLASS}>
        <h2
          id="checkout-order-items-preview-title"
          className={CHECKOUT_PRODUCTS_TITLE_CLASS}
        >
          {title}
        </h2>
        <p className={CHECKOUT_PRODUCTS_COUNT_CLASS}>
          {formatItemCount(itemCount, itemsOneLabel, itemsManyLabel)}
        </p>
      </div>

      <ul ref={scrollerRef} className={CHECKOUT_PRODUCTS_LIST_CLASS}>
        {products.map((product) => (
          <li key={product.id} className={CHECKOUT_PRODUCT_CARD_CLASS}>
            <button
              type="button"
              onClick={() => onRemove(product.id)}
              disabled={pending}
              className={CHECKOUT_PRODUCT_REMOVE_CLASS}
              aria-label={removeItemLabel}
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>

            <div className="flex items-stretch gap-3 pr-6">
              <div className="relative h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-xl bg-marco-gray">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.title}
                    fill
                    sizes="72px"
                    className="object-contain p-1.5"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                    —
                  </div>
                )}
              </div>
              <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 pb-6">
                <p
                  className="line-clamp-2 text-sm font-semibold text-marco-ink"
                  title={product.title}
                >
                  {product.title}
                </p>
                <p className="text-sm font-medium text-marco-slate">
                  {product.priceFormatted}
                </p>
              </div>
            </div>

            <span className={CHECKOUT_PRODUCT_QTY_CLASS}>
              ×{product.quantity}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
