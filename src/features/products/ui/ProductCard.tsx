import Image from "next/image";
import type { CSSProperties } from "react";

import { AppLink } from "@/components/ui/AppLink";
import { AddToCartButton } from "@/features/cart/ui/AddToCartButton";
import { CompareButton } from "@/features/compare/ui/CompareButton";
import type { ProductTag } from "@/db/schema";
import { ProductCardBrand } from "@/features/products/ui/ProductCardBrand";
import { ProductWarrantyBadge } from "@/features/products/ui/ProductCardMeta";
import {
  PRODUCT_CARD_ACTIONS_STACK_INSET_RIGHT_PX,
  PRODUCT_CARD_ACTIONS_STACK_INSET_TOP_PX,
  PRODUCT_CARD_ACTIONS_STACK_MOBILE_GRID_EXTRA_RIGHT_PX,
  PRODUCT_CARD_ACTIONS_STACK_OUTSET_RIGHT_PX,
  PRODUCT_CARD_ACTIONS_STACK_OUTSET_TOP_PX,
  PRODUCT_CARD_ACTIONS_STACK_SHIFT_LEFT_PX,
  PRODUCT_CARD_CART_BOTTOM_DESKTOP_CSS_VAR,
  PRODUCT_CARD_CART_BOTTOM_MOBILE_CSS_VAR,
  PRODUCT_CARD_CART_BUTTON_INSET_BOTTOM_PX,
  PRODUCT_CARD_CART_BUTTON_INSET_RIGHT_PX,
  PRODUCT_CARD_CART_CLASS,
  PRODUCT_CARD_CART_MOBILE_BOTTOM_PX,
  PRODUCT_CARD_CART_RIGHT_DESKTOP_CSS_VAR,
  PRODUCT_CARD_CORNER_MASK_TRANSLATE_PERCENT,
  PRODUCT_CARD_CUTOUT_SIZE_PX,
  PRODUCT_CARD_DISCOUNT_CLASS,
  PRODUCT_CARD_HEIGHT_PX,
  PRODUCT_CARD_IMAGE_TO_TEXT_GAP_PX,
  PRODUCT_CARD_IMAGE_WELL_HEIGHT_PX,
  PRODUCT_CARD_INK_CLASS,
  PRODUCT_CARD_MAX_WIDTH_CLASS,
  PRODUCT_CARD_MOBILE_NOTCH_HEIGHT_PX,
  PRODUCT_CARD_MOBILE_NOTCH_TOP_RADIUS_PX,
  PRODUCT_CARD_MOBILE_NOTCH_WIDTH_PX,
  PRODUCT_CARD_OLD_PRICE_FONT_SIZE_PX,
  PRODUCT_CARD_PADDING_TOP_CSS_VAR,
  PRODUCT_CARD_PADDING_TOP_PX,
  PRODUCT_CARD_PADDING_X_CSS_VAR,
  PRODUCT_CARD_PADDING_X_PX,
  PRODUCT_CARD_PRICE_FONT_SIZE_PX,
  PRODUCT_CARD_PRICE_LINE_HEIGHT_PX,
  PRODUCT_CARD_PRICE_PAD_END_CSS_VAR,
  PRODUCT_CARD_PRICE_ROW_END_PADDING_PX,
  PRODUCT_CARD_PRICE_TO_BRAND_GAP_PX,
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
  skuLine?: string | null;
  priceFormatted: string;
  compareAtFormatted?: string | null;
  discountPercent?: number | null;
  imageUrl: string | null;
  brandLogoUrl?: string | null;
  brandName?: string | null;
  inStock: boolean;
  inWishlist?: boolean;
  inCompare?: boolean;
  warrantyYears?: number | null;
  warrantyYearsSuffix?: string | null;
  warrantyYearsLabel?: string | null;
  warrantyCaption?: string | null;
  tags?: readonly ProductTag[];
};

type ProductCardLayout = "default" | "mobileGrid";

type ProductCardProps = {
  product: ProductCardItem;
  locale: Locale;
  wishlistLabel: string;
  compareLabel: string;
  addToCartLabel: string;
  isSignedIn: boolean;
  priority?: boolean;
  maxWidthClassName?: string;
  layout?: ProductCardLayout;
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
  layout = "default",
}: ProductCardProps) {
  const radius = PRODUCT_CARD_RADIUS_PX;
  const cornerTranslatePx = Math.round(
    (PRODUCT_CARD_CUTOUT_SIZE_PX * PRODUCT_CARD_CORNER_MASK_TRANSLATE_PERCENT) /
      100,
  );

  const shellStyle = {
    [PRODUCT_CARD_PADDING_X_CSS_VAR]: `${PRODUCT_CARD_PADDING_X_PX}px`,
    [PRODUCT_CARD_PADDING_TOP_CSS_VAR]: `${PRODUCT_CARD_PADDING_TOP_PX}px`,
    [PRODUCT_CARD_CART_BOTTOM_MOBILE_CSS_VAR]: `${PRODUCT_CARD_CART_MOBILE_BOTTOM_PX}px`,
    [PRODUCT_CARD_CART_BOTTOM_DESKTOP_CSS_VAR]: `${PRODUCT_CARD_CART_BUTTON_INSET_BOTTOM_PX}px`,
    [PRODUCT_CARD_CART_RIGHT_DESKTOP_CSS_VAR]: `${PRODUCT_CARD_CART_BUTTON_INSET_RIGHT_PX}px`,
    [PRODUCT_CARD_PRICE_PAD_END_CSS_VAR]: `${PRODUCT_CARD_PRICE_ROW_END_PADDING_PX}px`,
  } as CSSProperties;

  return (
    <div
      className={`relative z-10 min-w-0 w-full font-sans hover:z-30 focus-within:z-30 max-md:[--product-card-pad-x:0px] max-md:[--product-card-pad-top:0px] ${maxWidthClassName}`}
      style={shellStyle}
    >
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
        <ProductCardCutouts cornerTranslatePx={cornerTranslatePx} />
        <ProductCardBody product={product} priority={priority} />
      </article>
      <ProductCardActions
        product={product}
        locale={locale}
        wishlistLabel={wishlistLabel}
        compareLabel={compareLabel}
        addToCartLabel={addToCartLabel}
        isSignedIn={isSignedIn}
        layout={layout}
      />
    </div>
  );
}

function ProductCardCutouts({
  cornerTranslatePx,
}: {
  cornerTranslatePx: number;
}) {
  return (
    <>
      <span
        aria-hidden
        className="pointer-events-none absolute right-0 bottom-0 z-0 hidden rounded-full bg-white md:block"
        style={{
          width: PRODUCT_CARD_CUTOUT_SIZE_PX,
          height: PRODUCT_CARD_CUTOUT_SIZE_PX,
          transform: `translate(${cornerTranslatePx}px, ${cornerTranslatePx}px)`,
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-1/2 z-0 max-w-full -translate-x-1/2 bg-white md:hidden"
        style={{
          width: `min(100%, ${PRODUCT_CARD_MOBILE_NOTCH_WIDTH_PX}px)`,
          height: PRODUCT_CARD_MOBILE_NOTCH_HEIGHT_PX,
          borderTopLeftRadius: PRODUCT_CARD_MOBILE_NOTCH_TOP_RADIUS_PX,
          borderTopRightRadius: PRODUCT_CARD_MOBILE_NOTCH_TOP_RADIUS_PX,
        }}
      />
    </>
  );
}

function ProductCardWarranty({ product }: { product: ProductCardItem }) {
  if (!product.warrantyCaption) return null;

  const hasPromo =
    product.warrantyYears != null &&
    product.warrantyYears > 0 &&
    Boolean(product.warrantyYearsSuffix);

  if (!hasPromo && !product.warrantyYearsLabel) return null;

  return (
    <div className="absolute top-1.5 left-3 z-30 max-md:left-1.5">
      <ProductWarrantyBadge
        yearsLabel={
          product.warrantyYearsLabel ?? String(product.warrantyYears ?? "")
        }
        caption={product.warrantyCaption}
        years={hasPromo ? product.warrantyYears ?? undefined : undefined}
        yearsSuffix={hasPromo ? product.warrantyYearsSuffix ?? undefined : undefined}
        size={hasPromo ? "promo" : "default"}
      />
    </div>
  );
}

function ProductCardMedia({
  product,
  priority,
}: {
  product: ProductCardItem;
  priority: boolean;
}) {
  return (
    <div
      className="relative z-20 w-full min-h-0 overflow-hidden max-md:rounded-none md:rounded-[19px]"
      style={{ height: PRODUCT_CARD_IMAGE_WELL_HEIGHT_PX }}
      data-cart-fly-source
    >
      {product.imageUrl ? (
        <Image
          src={product.imageUrl}
          alt=""
          fill
          sizes="(max-width: 768px) 42vw, 286px"
          className="object-contain max-md:object-cover max-md:object-center"
          priority={priority}
        />
      ) : (
        <div className="flex h-full items-center justify-center text-xs text-gray-400">
          —
        </div>
      )}
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
    <div className="pointer-events-none relative z-10 flex min-h-0 flex-1 flex-col px-4 pt-3 pb-6 max-md:px-0 max-md:pt-0">
      <ProductCardWarranty product={product} />
      <ProductCardMedia product={product} priority={priority} />
      <div
        className="flex min-h-0 w-full flex-1 flex-col max-md:px-4"
        style={{ marginTop: PRODUCT_CARD_IMAGE_TO_TEXT_GAP_PX }}
      >
        <h3 className="line-clamp-2 text-left text-[14px] font-bold leading-5 text-marco-slate">
          {product.title}
        </h3>
        {product.skuLine ? (
          <p className="mt-0.5 truncate text-left text-[11px] leading-4 text-marco-slate">
            {product.skuLine}
          </p>
        ) : null}
        <div className="mt-auto w-full min-w-0">
          <div
            className="min-w-0 max-md:pr-0 md:[padding-right:var(--product-card-price-pad-end)]"
            style={{ marginBottom: PRODUCT_CARD_PRICE_TO_BRAND_GAP_PX }}
          >
            <p
              className={`whitespace-nowrap font-black ${PRODUCT_CARD_INK_CLASS}`}
              style={{
                fontSize: PRODUCT_CARD_PRICE_FONT_SIZE_PX,
                lineHeight: `${PRODUCT_CARD_PRICE_LINE_HEIGHT_PX}px`,
              }}
            >
              {product.priceFormatted}
            </p>
            {product.compareAtFormatted ? (
              <p
                className="text-gray-400 line-through"
                style={{ fontSize: PRODUCT_CARD_OLD_PRICE_FONT_SIZE_PX }}
              >
                {product.compareAtFormatted}
              </p>
            ) : null}
          </div>
          <ProductCardBrand
            logoUrl={product.brandLogoUrl}
            name={product.brandName}
          />
        </div>
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
  layout,
}: Omit<ProductCardProps, "priority" | "maxWidthClassName">) {
  const topOffsetPx =
    PRODUCT_CARD_ACTIONS_STACK_INSET_TOP_PX -
    PRODUCT_CARD_ACTIONS_STACK_OUTSET_TOP_PX;
  const rightOffsetPx =
    PRODUCT_CARD_ACTIONS_STACK_INSET_RIGHT_PX -
    PRODUCT_CARD_ACTIONS_STACK_OUTSET_RIGHT_PX +
    PRODUCT_CARD_ACTIONS_STACK_SHIFT_LEFT_PX +
    (layout === "mobileGrid"
      ? PRODUCT_CARD_ACTIONS_STACK_MOBILE_GRID_EXTRA_RIGHT_PX
      : 0);

  return (
    <>
      <div
        className="absolute z-50 flex flex-col items-end gap-2"
        style={{
          top: `calc(var(${PRODUCT_CARD_PADDING_TOP_CSS_VAR}, ${PRODUCT_CARD_PADDING_TOP_PX}px) + ${topOffsetPx}px)`,
          right: `calc(var(${PRODUCT_CARD_PADDING_X_CSS_VAR}, ${PRODUCT_CARD_PADDING_X_PX}px) + ${rightOffsetPx}px)`,
        }}
      >
        <WishlistButton
          locale={locale}
          productId={product.id}
          initialInWishlist={product.inWishlist ?? false}
          isSignedIn={isSignedIn}
          label={wishlistLabel}
          size="sm"
          className={PRODUCT_CARD_WISHLIST_CLASS}
          inactiveIconClassName="fill-none text-white"
          activeIconClassName="fill-red-500 text-red-500"
        />
        <CompareButton
          productId={product.id}
          initialInCompare={product.inCompare ?? false}
          label={compareLabel}
          size="sm"
          className={PRODUCT_CARD_WISHLIST_CLASS}
          inactiveIconClassName="text-white"
          activeIconClassName="text-marco-yellow"
        />
        {product.discountPercent != null ? (
          <span className={PRODUCT_CARD_DISCOUNT_CLASS}>
            -{product.discountPercent}%
          </span>
        ) : null}
      </div>
      <div className="pointer-events-none absolute max-md:z-50 max-md:bottom-[var(--product-card-cart-bottom-mobile)] max-md:left-1/2 max-md:right-auto max-md:-translate-x-1/2 md:z-30 md:bottom-[var(--product-card-cart-bottom-desktop)] md:left-auto md:right-[var(--product-card-cart-right-desktop)] md:translate-x-0">
        <div className="pointer-events-auto">
          <AddToCartButton
            productId={product.id}
            label={addToCartLabel}
            disabled={!product.inStock}
            size="sm"
            iconVariant="figma"
            imageUrl={product.imageUrl}
            className={PRODUCT_CARD_CART_CLASS}
          />
        </div>
      </div>
    </>
  );
}
