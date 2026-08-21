import Image from "next/image";

import { AppLink } from "@/components/ui/AppLink";
import { AddToCartButton } from "@/features/cart/ui/AddToCartButton";
import { CompareButton } from "@/features/compare/ui/CompareButton";
import type { ProductTag } from "@/db/schema";
import { ProductWarrantyBadge } from "@/features/products/ui/ProductCardMeta";
import {
  PRODUCT_CARD_BRAND_LOGO_HEIGHT_PX,
  PRODUCT_CARD_BRAND_LOGO_MAX_WIDTH_PX,
  PRODUCT_CARD_CART_CLASS,
  PRODUCT_CARD_COMPARE_ACTIVE_CLASS,
  PRODUCT_CARD_CUTOUT_SIZE_PX,
  PRODUCT_CARD_DISCOUNT_CLASS,
  PRODUCT_CARD_HEIGHT_PX,
  PRODUCT_CARD_INK_CLASS,
  PRODUCT_CARD_MAX_WIDTH_CLASS,
  PRODUCT_CARD_MOBILE_NOTCH_HEIGHT_PX,
  PRODUCT_CARD_MOBILE_NOTCH_TOP_RADIUS_PX,
  PRODUCT_CARD_MOBILE_NOTCH_WIDTH_PX,
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
  inStock: boolean;
  inWishlist?: boolean;
  inCompare?: boolean;
  warrantyYears?: number | null;
  warrantyYearsSuffix?: string | null;
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
        <ProductCardCutouts />
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

function ProductCardCutouts() {
  return (
    <>
      <span
        aria-hidden
        className="pointer-events-none absolute right-0 bottom-0 z-0 hidden rounded-full bg-white md:block"
        style={{
          width: PRODUCT_CARD_CUTOUT_SIZE_PX,
          height: PRODUCT_CARD_CUTOUT_SIZE_PX,
          transform: "translate(23px, 23px)",
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
      className="relative z-20 mx-auto mt-10 mb-3 aspect-square w-[70%] min-h-0 overflow-hidden max-md:mx-0 max-md:mt-0 max-md:mb-0 max-md:aspect-auto max-md:h-[177px] max-md:w-full max-md:rounded-none md:rounded-[19px]"
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
      <div className="flex min-h-0 w-full flex-1 flex-col max-md:mt-[31px] max-md:px-4">
        {product.brandLogoUrl ? (
          <div className="mb-1.5 flex h-6 items-center">
            <Image
              src={product.brandLogoUrl}
              alt=""
              width={PRODUCT_CARD_BRAND_LOGO_MAX_WIDTH_PX}
              height={PRODUCT_CARD_BRAND_LOGO_HEIGHT_PX}
              className="max-h-6 w-auto object-contain object-left"
            />
          </div>
        ) : null}
        <h3 className="line-clamp-2 text-left text-[14px] font-bold leading-5 text-marco-slate md:min-h-[2.5rem] md:text-sm md:font-semibold">
          {product.title}
        </h3>
        {product.skuLine ? (
          <p className="mt-0.5 truncate text-left text-[11px] leading-4 text-gray-500">
            {product.skuLine}
          </p>
        ) : null}
        <div className="mt-auto min-w-0 max-md:pr-0 md:pr-14">
          <p
            className={`whitespace-nowrap text-xl font-black ${PRODUCT_CARD_INK_CLASS}`}
          >
            {product.priceFormatted}
          </p>
          {product.compareAtFormatted ? (
            <p className="text-xs text-gray-400 line-through">
              {product.compareAtFormatted}
            </p>
          ) : null}
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
}: Omit<ProductCardProps, "priority" | "maxWidthClassName">) {
  return (
    <>
      <div className="absolute top-4 right-2 z-50 flex flex-col items-end gap-2 max-md:right-3.5">
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
          <span className={PRODUCT_CARD_DISCOUNT_CLASS}>
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
