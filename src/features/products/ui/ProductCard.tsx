import Image from "next/image";

import { AppLink } from "@/components/ui/AppLink";
import { AddToCartButton } from "@/features/cart/ui/AddToCartButton";
import { CompareButton } from "@/features/compare/ui/CompareButton";
import type { ProductTag } from "@/db/schema";
import { ProductWarrantyBadge } from "@/features/products/ui/ProductCardMeta";
import {
  PRODUCT_CARD_CART_CLASS,
  PRODUCT_CARD_COMPARE_ACTIVE_CLASS,
  PRODUCT_CARD_CUTOUT_SIZE_PX,
  PRODUCT_CARD_HEIGHT_PX,
  PRODUCT_CARD_INK_CLASS,
  PRODUCT_CARD_MAX_WIDTH_CLASS,
  PRODUCT_CARD_RADIUS_PX,
  PRODUCT_CARD_SHELL_CLASS,
  PRODUCT_CARD_WISHLIST_CLASS,
} from "@/features/products/ui/product-card.constants";
import { WishlistButton } from "@/features/wishlist/ui/WishlistButton";
import type { Locale } from "@/lib/i18n/config";

export type ProductCardItem = {
  id: string;
  href: string;
  title: string;
  priceFormatted: string;
  compareAtFormatted?: string | null;
  discountPercent?: number | null;
  imageUrl: string | null;
  inStock: boolean;
  inWishlist?: boolean;
  inCompare?: boolean;
  warrantyYearsLabel?: string | null;
  warrantyCaption?: string | null;
  tags?: readonly ProductTag[];
};

type ProductCardProps = {
  product: ProductCardItem;
  locale: Locale;
  wishlistLabel: string;
  compareLabel: string;
  addToCartLabel: string;
  isSignedIn: boolean;
  priority?: boolean;
  maxWidthClassName?: string;
};

export function ProductCard({
  product,
  locale,
  wishlistLabel,
  compareLabel,
  addToCartLabel,
  isSignedIn,
  priority = false,
  maxWidthClassName = PRODUCT_CARD_MAX_WIDTH_CLASS,
}: ProductCardProps) {
  const radius = PRODUCT_CARD_RADIUS_PX;

  return (
    <div className={`relative z-10 min-w-0 w-full ${maxWidthClassName}`}>
      <article
        className={`relative flex h-full min-h-0 w-full flex-col overflow-hidden ${PRODUCT_CARD_SHELL_CLASS}`}
        style={{ height: PRODUCT_CARD_HEIGHT_PX, borderRadius: radius }}
      >
        <AppLink
          href={product.href}
          prefetchPolicy={priority ? "intent" : "auto"}
          className="absolute inset-0 z-[1] focus-visible:ring-2 focus-visible:ring-marco-yellow focus-visible:ring-offset-2"
          style={{ borderRadius: radius }}
          aria-label={product.title}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute right-0 bottom-0 z-0 hidden rounded-full bg-white md:block"
          style={{
            width: PRODUCT_CARD_CUTOUT_SIZE_PX,
            height: PRODUCT_CARD_CUTOUT_SIZE_PX,
            transform: "translate(23px, 23px)",
          }}
        />
        <ProductCardBody product={product} priority={priority} />
      </article>
      <ProductCardActions
        product={product}
        locale={locale}
        wishlistLabel={wishlistLabel}
        compareLabel={compareLabel}
        addToCartLabel={addToCartLabel}
        isSignedIn={isSignedIn}
      />
    </div>
  );
}

function ProductCardBody({
  product,
  priority,
}: {
  product: ProductCardItem;
  priority: boolean;
}) {
  return (
    <div className="pointer-events-none relative z-10 flex min-h-0 flex-1 flex-col px-4 pt-3 pb-6">
      {product.warrantyYearsLabel && product.warrantyCaption ? (
        <div className="absolute top-1.5 left-3 z-30">
          <ProductWarrantyBadge
            yearsLabel={product.warrantyYearsLabel}
            caption={product.warrantyCaption}
          />
        </div>
      ) : null}
      <div
        className="relative mx-auto mt-10 mb-3 aspect-square w-[70%] min-h-0"
        data-cart-fly-source
      >
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt=""
            fill
            sizes="286px"
            className="object-contain"
            priority={priority}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-gray-400">
            —
          </div>
        )}
      </div>
      <h3 className={`line-clamp-2 min-h-[2.5rem] text-sm font-semibold ${PRODUCT_CARD_INK_CLASS}`}>
        {product.title}
      </h3>
      <div className="mt-auto min-w-0 pr-14">
        <p className={`text-xl font-black ${PRODUCT_CARD_INK_CLASS}`}>
          {product.priceFormatted}
        </p>
        {product.compareAtFormatted ? (
          <p className="text-xs text-gray-400 line-through">
            {product.compareAtFormatted}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function ProductCardActions({
  product,
  locale,
  wishlistLabel,
  compareLabel,
  addToCartLabel,
  isSignedIn,
}: Omit<ProductCardProps, "priority" | "maxWidthClassName">) {
  return (
    <>
      <div className="absolute top-4 right-2 z-50 flex flex-col items-end gap-2">
        <WishlistButton
          locale={locale}
          productId={product.id}
          initialInWishlist={product.inWishlist ?? false}
          isSignedIn={isSignedIn}
          label={wishlistLabel}
          size="sm"
          className={PRODUCT_CARD_WISHLIST_CLASS}
          iconClassName="text-white"
        />
        <CompareButton
          productId={product.id}
          initialInCompare={product.inCompare ?? false}
          label={compareLabel}
          size="sm"
          className={PRODUCT_CARD_WISHLIST_CLASS}
          activeClassName={PRODUCT_CARD_COMPARE_ACTIVE_CLASS}
          iconClassName="text-current"
        />
        {product.discountPercent != null ? (
          <span className="rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white">
            -{product.discountPercent}%
          </span>
        ) : null}
      </div>
      <div className="absolute bottom-[-26px] left-1/2 z-30 -translate-x-1/2 md:right-1 md:bottom-1 md:left-auto md:translate-x-0">
        <AddToCartButton
          productId={product.id}
          label={addToCartLabel}
          disabled={!product.inStock}
          size="sm"
          imageUrl={product.imageUrl}
          className={PRODUCT_CARD_CART_CLASS}
          iconClassName="text-white"
        />
      </div>
    </>
  );
}
