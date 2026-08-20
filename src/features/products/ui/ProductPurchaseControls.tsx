"use client";

import type { MouseEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { addToCart } from "@/features/cart/cart";
import { playCartFlyAnimation } from "@/features/cart/play-cart-fly-animation";
import {
  PDP_BUY_CTA_HEIGHT_CLASS,
  PDP_BUY_CTA_ICON_PX,
  PDP_BUY_CTA_LABEL_MAX_WIDTH_CLASS,
  PDP_BUY_CTA_RADIUS_CLASS,
} from "@/features/products/ui/product-pdp.constants";
import { CompareButton } from "@/features/compare/ui/CompareButton";
import { WishlistButton } from "@/features/wishlist/ui/WishlistButton";
import type { Locale } from "@/lib/i18n/config";

type ProductPurchaseControlsProps = {
  locale: Locale;
  productId: string;
  stockOnHand: number;
  inWishlist: boolean;
  inCompare: boolean;
  isSignedIn: boolean;
  wishlistLabel: string;
  compareLabel: string;
  imageUrl?: string | null;
  labels: {
    quantity: string;
    decreaseQuantity: string;
    increaseQuantity: string;
    buyNow: string;
    adding: string;
    outOfStock: string;
    added: string;
    error: string;
  };
};

export function ProductPurchaseControls({
  locale,
  productId,
  stockOnHand,
  inWishlist,
  inCompare,
  isSignedIn,
  wishlistLabel,
  compareLabel,
  imageUrl = null,
  labels,
}: ProductPurchaseControlsProps) {
  const router = useRouter();
  const maxQty = Math.max(stockOnHand, 0);
  const [quantity, setQuantity] = useState(maxQty > 0 ? 1 : 0);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const disabled = maxQty < 1;

  function changeQuantity(next: number): void {
    if (disabled) return;
    setQuantity(Math.min(Math.max(1, next), maxQty));
    setMessage(null);
    setError(null);
  }

  function handleAdd(event: MouseEvent<HTMLButtonElement>): void {
    if (disabled || quantity < 1) return;
    setMessage(null);
    setError(null);
    const flySource =
      document.querySelector<HTMLElement>("[data-product-detail-fly-source]") ??
      event.currentTarget;
    playCartFlyAnimation({ fromElement: flySource, imageUrl });
    startTransition(async () => {
      try {
        await addToCart(productId, quantity);
        setMessage(labels.added);
        router.refresh();
      } catch {
        setError(labels.error);
      }
    });
  }

  const ctaLabel = disabled
    ? labels.outOfStock
    : pending
      ? labels.adding
      : labels.buyNow;

  return (
    <div className="mt-auto pt-6">
      <div className="flex min-w-0 flex-nowrap items-center gap-2 pt-4 pb-2 sm:gap-3">
        <QuantityStepper
          quantity={quantity}
          disabled={disabled}
          pending={pending}
          maxQty={maxQty}
          labels={labels}
          onDecrease={() => changeQuantity(quantity - 1)}
          onIncrease={() => changeQuantity(quantity + 1)}
        />
        <CompareButton
          productId={productId}
          initialInCompare={inCompare}
          label={compareLabel}
          className="size-12 rounded-xl border-2 border-gray-200 bg-white text-marco-ink"
          activeClassName="size-12 rounded-xl border-2 border-marco-yellow bg-marco-yellow text-marco-ink"
          iconClassName="text-current"
        />
        <WishlistButton
          locale={locale}
          productId={productId}
          initialInWishlist={inWishlist}
          isSignedIn={isSignedIn}
          label={wishlistLabel}
          className="size-12 rounded-xl border-2 border-gray-200 bg-white text-marco-ink"
          activeClassName="size-12 rounded-xl border-2 border-red-600 bg-red-600 text-white"
          iconClassName="text-current"
        />
        <button
          type="button"
          disabled={disabled || pending}
          onClick={handleAdd}
          className={`inline-flex shrink-0 items-center gap-1.5 bg-marco-yellow px-4 text-left text-sm font-bold text-marco-ink transition-[filter,transform] hover:-translate-y-0.5 hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 ${PDP_BUY_CTA_HEIGHT_CLASS} ${PDP_BUY_CTA_RADIUS_CLASS}`}
        >
          <span
            className={`${PDP_BUY_CTA_LABEL_MAX_WIDTH_CLASS} truncate whitespace-nowrap pl-1`}
          >
            {ctaLabel}
          </span>
          <span
            className="flex shrink-0 translate-x-2 items-center justify-center rounded-full bg-black text-white"
            style={{
              width: PDP_BUY_CTA_ICON_PX,
              height: PDP_BUY_CTA_ICON_PX,
            }}
            aria-hidden
          >
            <ArrowUpRight className="size-3.5" strokeWidth={2.5} />
          </span>
        </button>
      </div>
      {message ? (
        <p
          className="mt-4 rounded-md bg-marco-ink p-4 text-sm text-white shadow-lg"
          role="status"
        >
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="mt-4 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function QuantityStepper({
  quantity,
  disabled,
  pending,
  maxQty,
  labels,
  onDecrease,
  onIncrease,
}: {
  quantity: number;
  disabled: boolean;
  pending: boolean;
  maxQty: number;
  labels: ProductPurchaseControlsProps["labels"];
  onDecrease: () => void;
  onIncrease: () => void;
}) {
  return (
    <div
      className={`flex ${PDP_BUY_CTA_HEIGHT_CLASS} shrink-0 items-center overflow-hidden rounded-xl border-2 border-gray-200 bg-white`}
    >
      <button
        type="button"
        aria-label={labels.decreaseQuantity}
        disabled={disabled || quantity <= 1 || pending}
        onClick={onDecrease}
        className={`flex ${PDP_BUY_CTA_HEIGHT_CLASS} w-8 items-center justify-center text-sm disabled:opacity-50`}
      >
        -
      </button>
      <span
        className="w-8 text-center text-sm font-bold tabular-nums text-marco-ink"
        aria-label={labels.quantity}
      >
        {quantity}
      </span>
      <button
        type="button"
        aria-label={labels.increaseQuantity}
        disabled={disabled || quantity >= maxQty || pending}
        onClick={onIncrease}
        className={`flex ${PDP_BUY_CTA_HEIGHT_CLASS} w-8 items-center justify-center text-sm disabled:opacity-50`}
      >
        +
      </button>
    </div>
  );
}
