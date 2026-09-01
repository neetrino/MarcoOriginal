import Image from "next/image";

import { AddToCartButton } from "@/features/cart/ui/AddToCartButton";
import { CompareButton } from "@/features/compare/ui/CompareButton";
import { ProductCardBrand } from "@/features/products/ui/ProductCardBrand";
import type {
  ProductCardItem,
  ProductCardLayout,
} from "@/features/products/ui/product-card.types";
import { ProductWarrantyBadge } from "@/features/products/ui/ProductCardMeta";
import {
  PRODUCT_CARD_ACTIONS_STACK_INSET_RIGHT_PX,
  PRODUCT_CARD_ACTIONS_STACK_INSET_TOP_PX,
  PRODUCT_CARD_ACTIONS_STACK_MOBILE_GRID_EXTRA_RIGHT_PX,
  PRODUCT_CARD_ACTIONS_STACK_OUTSET_RIGHT_PX,
  PRODUCT_CARD_ACTIONS_STACK_OUTSET_TOP_PX,
  PRODUCT_CARD_ACTIONS_STACK_SHIFT_LEFT_PX,
  PRODUCT_CARD_BRAND_LOGO_LIFT_MOBILE_PX,
  PRODUCT_CARD_CART_CLASS,
  PRODUCT_CARD_CUTOUT_SIZE_PX,
  PRODUCT_CARD_DISCOUNT_CLASS,
  PRODUCT_CARD_IMAGE_TO_TEXT_GAP_PX,
  PRODUCT_CARD_IMAGE_WELL_HEIGHT_PX,
  PRODUCT_CARD_IMAGE_WELL_RADIUS_CLASS,
  PRODUCT_CARD_INK_CLASS,
  PRODUCT_CARD_MOBILE_NOTCH_HEIGHT_PX,
  PRODUCT_CARD_MOBILE_NOTCH_TOP_RADIUS_PX,
  PRODUCT_CARD_MOBILE_NOTCH_WIDTH_PX,
  PRODUCT_CARD_OLD_PRICE_FONT_SIZE_PX,
  PRODUCT_CARD_PADDING_TOP_CSS_VAR,
  PRODUCT_CARD_PADDING_TOP_PX,
  PRODUCT_CARD_PADDING_X_CSS_VAR,
  PRODUCT_CARD_PADDING_X_PX,
  PRODUCT_CARD_PRICE_BLOCK_LIFT_FROM_BOTTOM_PX,
  PRODUCT_CARD_PRICE_FONT_SIZE_PX,
  PRODUCT_CARD_PRICE_LINE_HEIGHT_PX,
  PRODUCT_CARD_PRICE_TO_BRAND_GAP_MOBILE_PX,
  PRODUCT_CARD_TEXT_SHIFT_DOWN_MOBILE_PX,
  PRODUCT_CARD_TITLE_BLOCK_HEIGHT_PX,
  PRODUCT_CARD_TITLE_TO_PRICE_GAP_PX,
  PRODUCT_CARD_WARRANTY_INSET_LEFT_MOBILE_GRID_PX,
  PRODUCT_CARD_WARRANTY_INSET_LEFT_PX,
  PRODUCT_CARD_WARRANTY_INSET_TOP_PX,
  PRODUCT_CARD_WISHLIST_CLASS,
} from "@/features/products/ui/product-card.constants";
import { WishlistButton } from "@/features/wishlist/ui/WishlistButton";
import type { Locale } from "@/lib/i18n/config";

export function ProductCardCutouts({
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

function productCardHasWarranty(product: ProductCardItem): boolean {
  if (!product.warrantyCaption) return false;
  const hasPromo =
    product.warrantyYears != null &&
    product.warrantyYears > 0 &&
    Boolean(product.warrantyYearsSuffix);
  return hasPromo || Boolean(product.warrantyYearsLabel);
}

function ProductCardWarranty({
  product,
  layout,
}: {
  product: ProductCardItem;
  layout: ProductCardLayout;
}) {
  if (!productCardHasWarranty(product)) return null;

  const hasPromo =
    product.warrantyYears != null &&
    product.warrantyYears > 0 &&
    Boolean(product.warrantyYearsSuffix);
  const leftInsetPx =
    layout === "mobileGrid"
      ? PRODUCT_CARD_WARRANTY_INSET_LEFT_MOBILE_GRID_PX
      : PRODUCT_CARD_WARRANTY_INSET_LEFT_PX;

  return (
    <div
      className="pointer-events-none absolute z-30"
      style={{
        top: PRODUCT_CARD_WARRANTY_INSET_TOP_PX,
        left: leftInsetPx,
      }}
    >
      <ProductWarrantyBadge
        yearsLabel={
          product.warrantyYearsLabel ?? String(product.warrantyYears ?? "")
        }
        caption={product.warrantyCaption ?? ""}
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
      className={`relative z-20 w-full min-h-0 overflow-hidden ${PRODUCT_CARD_IMAGE_WELL_RADIUS_CLASS}`}
      style={{ height: PRODUCT_CARD_IMAGE_WELL_HEIGHT_PX }}
      data-cart-fly-source
    >
      {product.imageUrl ? (
        <Image
          src={product.imageUrl}
          alt=""
          fill
          sizes="(max-width: 768px) 42vw, 288px"
          className="object-cover object-center"
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

export function ProductCardBody({
  product,
  priority,
  layout,
}: {
  product: ProductCardItem;
  priority: boolean;
  layout: ProductCardLayout;
}) {
  const textBlockShiftStyle =
    layout === "mobileGrid"
      ? { transform: `translateY(${PRODUCT_CARD_TEXT_SHIFT_DOWN_MOBILE_PX}px)` }
      : undefined;

  return (
    <div className="pointer-events-none relative z-10 flex min-h-0 flex-1 flex-col px-4 pt-3 pb-6 max-md:px-0 max-md:pt-0">
      <ProductCardWarranty product={product} layout={layout} />
      <ProductCardMedia product={product} priority={priority} />
      <div
        className="flex min-h-0 w-full flex-1 flex-col max-md:px-4"
        style={{
          marginTop: PRODUCT_CARD_IMAGE_TO_TEXT_GAP_PX,
          ...textBlockShiftStyle,
        }}
      >
        <div
          className="shrink-0"
          style={{ height: PRODUCT_CARD_TITLE_BLOCK_HEIGHT_PX }}
        >
          <h3 className="line-clamp-2 text-left text-[14px] font-bold leading-5 text-marco-slate">
            {product.title}
          </h3>
          {product.skuLine ? (
            <p className="mt-0.5 truncate text-left text-[11px] leading-4 text-marco-slate">
              {product.skuLine}
            </p>
          ) : null}
        </div>
        <div className="mt-auto w-full min-w-0">
          <div
            className="min-w-0 shrink-0 max-md:pr-0 md:[padding-right:var(--product-card-price-pad-end)]"
            style={{
              marginTop: PRODUCT_CARD_TITLE_TO_PRICE_GAP_PX,
              marginBottom:
                layout === "mobileGrid"
                  ? PRODUCT_CARD_PRICE_TO_BRAND_GAP_MOBILE_PX
                  : PRODUCT_CARD_PRICE_BLOCK_LIFT_FROM_BOTTOM_PX,
            }}
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
          <div
            className="min-h-[1.25rem] w-full min-w-0 shrink-0"
            style={
              layout === "mobileGrid"
                ? { marginBottom: PRODUCT_CARD_BRAND_LOGO_LIFT_MOBILE_PX }
                : undefined
            }
          >
            <ProductCardBrand
              logoUrl={product.brandLogoUrl}
              name={product.brandName}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

type ProductCardActionsProps = {
  product: ProductCardItem;
  locale: Locale;
  wishlistLabel: string;
  compareLabel: string;
  addToCartLabel: string;
  isSignedIn: boolean;
  layout: ProductCardLayout;
};

export function ProductCardActions({
  product,
  locale,
  wishlistLabel,
  compareLabel,
  addToCartLabel,
  isSignedIn,
  layout,
}: ProductCardActionsProps) {
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
