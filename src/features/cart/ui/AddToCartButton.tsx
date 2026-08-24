"use client";

import type { MouseEvent, ReactNode } from "react";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { addToCart } from "@/features/cart/cart";
import { playCartFlyAnimation } from "@/features/cart/play-cart-fly-animation";
import { ProductCardCartFigmaIcon } from "@/features/products/ui/ProductCardCartFigmaIcon";
import {
  PRODUCT_CARD_CART_BUTTON_SIZE_PX,
  PRODUCT_CARD_CART_BUTTON_SPINNER_PX,
} from "@/features/products/ui/product-card.constants";

type AddToCartButtonProps = {
  productId: string;
  label: string;
  disabled?: boolean;
  className?: string;
  iconClassName?: string;
  size?: "sm" | "md";
  iconVariant?: "lucide" | "figma";
  imageUrl?: string | null;
};

export function AddToCartButton({
  productId,
  label,
  disabled = false,
  className = "",
  iconClassName,
  size = "md",
  iconVariant = "lucide",
  imageUrl = null,
}: AddToCartButtonProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [justAdded, setJustAdded] = useState(false);
  const iconClass = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  const useFigmaIcon = iconVariant === "figma";
  const buttonSizeStyle =
    useFigmaIcon
      ? {
          width: PRODUCT_CARD_CART_BUTTON_SIZE_PX,
          height: PRODUCT_CARD_CART_BUTTON_SIZE_PX,
        }
      : undefined;

  function handleClick(event: MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();
    event.stopPropagation();
    if (disabled || pending) return;

    playCartFlyAnimation({
      fromElement: event.currentTarget,
      imageUrl,
    });

    startTransition(async () => {
      try {
        await addToCart(productId, 1);
        setJustAdded(true);
        router.refresh();
        window.setTimeout(() => setJustAdded(false), 1500);
      } catch {
        setJustAdded(false);
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || pending}
      aria-label={label}
      style={buttonSizeStyle}
      className={`inline-flex items-center justify-center rounded-full transition disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
    >
      {renderIcon({
        pending,
        justAdded,
        useFigmaIcon,
        iconClass,
        iconClassName,
      })}
    </button>
  );
}

function renderIcon({
  pending,
  justAdded,
  useFigmaIcon,
  iconClass,
  iconClassName,
}: {
  pending: boolean;
  justAdded: boolean;
  useFigmaIcon: boolean;
  iconClass: string;
  iconClassName?: string;
}): ReactNode {
  if (pending && useFigmaIcon) {
    return (
      <svg
        className="relative z-10 animate-spin text-white"
        style={{
          width: PRODUCT_CARD_CART_BUTTON_SPINNER_PX,
          height: PRODUCT_CARD_CART_BUTTON_SPINNER_PX,
        }}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    );
  }

  if (useFigmaIcon) {
    return <ProductCardCartFigmaIcon />;
  }

  return (
    <ShoppingCart
      className={`${iconClass} ${
        justAdded
          ? `fill-current ${iconClassName ?? "text-gray-900"}`
          : (iconClassName ?? "text-gray-700")
      }`}
      aria-hidden
    />
  );
}
