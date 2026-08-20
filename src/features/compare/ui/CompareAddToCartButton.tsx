"use client";

import type { MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { addToCart } from "@/features/cart/cart";
import { playCartFlyAnimation } from "@/features/cart/play-cart-fly-animation";

type CompareAddToCartButtonProps = {
  productId: string;
  label: string;
  disabled: boolean;
  imageUrl: string | null;
};

export function CompareAddToCartButton({
  productId,
  label,
  disabled,
  imageUrl,
}: CompareAddToCartButtonProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleClick(event: MouseEvent<HTMLButtonElement>): void {
    if (disabled || pending) {
      return;
    }

    playCartFlyAnimation({
      fromElement: event.currentTarget,
      imageUrl,
    });

    startTransition(async () => {
      try {
        await addToCart(productId, 1);
        router.refresh();
      } catch {
        return;
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || pending}
      className="inline-flex min-h-11 items-center justify-center rounded-full bg-marco-slate px-5 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {label}
    </button>
  );
}
