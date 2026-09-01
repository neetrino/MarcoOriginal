import type { CSSProperties } from "react";

import { AppLink } from "@/components/ui/AppLink";
import {
  ProductCardActions,
  ProductCardBody,
  ProductCardCutouts,
} from "@/features/products/ui/ProductCardParts";
import type {
  ProductCardItem,
  ProductCardLayout,
} from "@/features/products/ui/product-card.types";
import {
  PRODUCT_CARD_CART_BOTTOM_DESKTOP_CSS_VAR,
  PRODUCT_CARD_CART_BOTTOM_MOBILE_CSS_VAR,
  PRODUCT_CARD_CART_BUTTON_INSET_BOTTOM_PX,
  PRODUCT_CARD_CART_BUTTON_INSET_RIGHT_PX,
  PRODUCT_CARD_CART_MOBILE_BOTTOM_PX,
  PRODUCT_CARD_CART_RIGHT_DESKTOP_CSS_VAR,
  PRODUCT_CARD_CORNER_MASK_TRANSLATE_PERCENT,
  PRODUCT_CARD_CUTOUT_SIZE_PX,
  PRODUCT_CARD_HEIGHT_PX,
  PRODUCT_CARD_MAX_WIDTH_CLASS,
  PRODUCT_CARD_MAX_WIDTH_PX,
  PRODUCT_CARD_PADDING_TOP_CSS_VAR,
  PRODUCT_CARD_PADDING_TOP_PX,
  PRODUCT_CARD_PADDING_X_CSS_VAR,
  PRODUCT_CARD_PADDING_X_PX,
  PRODUCT_CARD_PRICE_PAD_END_CSS_VAR,
  PRODUCT_CARD_PRICE_ROW_END_PADDING_PX,
  PRODUCT_CARD_RADIUS_PX,
  PRODUCT_CARD_SHELL_CLASS,
} from "@/features/products/ui/product-card.constants";
import type { Locale } from "@/lib/i18n/config";

export type { ProductCardItem, ProductCardLayout };

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

/** Storefront product tile — home rails, catalog PLP, PDP related (marco.am SpecialOfferCard). */
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
  const fillsGridCell =
    layout === "mobileGrid" && maxWidthClassName === "max-w-none";

  const shellStyle = {
    ...(fillsGridCell
      ? { maxWidth: `min(100%, ${PRODUCT_CARD_MAX_WIDTH_PX}px)` }
      : {}),
    [PRODUCT_CARD_PADDING_X_CSS_VAR]: `${PRODUCT_CARD_PADDING_X_PX}px`,
    [PRODUCT_CARD_PADDING_TOP_CSS_VAR]: `${PRODUCT_CARD_PADDING_TOP_PX}px`,
    [PRODUCT_CARD_CART_BOTTOM_MOBILE_CSS_VAR]: `${PRODUCT_CARD_CART_MOBILE_BOTTOM_PX}px`,
    [PRODUCT_CARD_CART_BOTTOM_DESKTOP_CSS_VAR]: `${PRODUCT_CARD_CART_BUTTON_INSET_BOTTOM_PX}px`,
    [PRODUCT_CARD_CART_RIGHT_DESKTOP_CSS_VAR]: `${PRODUCT_CARD_CART_BUTTON_INSET_RIGHT_PX}px`,
    [PRODUCT_CARD_PRICE_PAD_END_CSS_VAR]: `${PRODUCT_CARD_PRICE_ROW_END_PADDING_PX}px`,
  } as CSSProperties;

  return (
    <div
      className={`relative z-10 min-w-0 w-full font-sans hover:z-30 focus-within:z-30 max-md:[--product-card-pad-x:0px] max-md:[--product-card-pad-top:0px] ${
        fillsGridCell ? "mx-0" : ""
      } ${maxWidthClassName}`}
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
        <ProductCardBody product={product} priority={priority} layout={layout} />
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
