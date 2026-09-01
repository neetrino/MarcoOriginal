/** Shared storefront product tile — aligned with marco.am SpecialOfferCard. */

export const PRODUCT_CARD_RADIUS_PX = 34;
export const PRODUCT_CARD_HEIGHT_PX = 400;
export const PRODUCT_CARD_CUTOUT_SIZE_PX = 96;
export const PRODUCT_CARD_CORNER_MASK_TRANSLATE_PERCENT = 24;
export const PRODUCT_CARD_MAX_WIDTH_PX = 252;
export const PRODUCT_CARD_PLP_MAX_WIDTH_PX = 286;
export const PRODUCT_CARD_MAX_WIDTH_CLASS = "max-w-[252px]";
export const PRODUCT_CARD_PLP_MAX_WIDTH_CLASS = "max-w-[286px]";

export const PRODUCT_CARD_PADDING_TOP_PX = 12;
export const PRODUCT_CARD_PADDING_X_PX = 16;
export const PRODUCT_CARD_PADDING_TOP_CSS_VAR = "--product-card-pad-top";
export const PRODUCT_CARD_PADDING_X_CSS_VAR = "--product-card-pad-x";
export const PRODUCT_CARD_CART_BOTTOM_MOBILE_CSS_VAR = "--product-card-cart-bottom-mobile";
export const PRODUCT_CARD_CART_BOTTOM_DESKTOP_CSS_VAR = "--product-card-cart-bottom-desktop";
export const PRODUCT_CARD_CART_RIGHT_DESKTOP_CSS_VAR = "--product-card-cart-right-desktop";
export const PRODUCT_CARD_PRICE_PAD_END_CSS_VAR = "--product-card-price-pad-end";

export const PRODUCT_CARD_ACTIONS_STACK_INSET_TOP_PX = 16;
export const PRODUCT_CARD_ACTIONS_STACK_INSET_RIGHT_PX = -8;
export const PRODUCT_CARD_ACTIONS_STACK_OUTSET_TOP_PX = 4;
export const PRODUCT_CARD_ACTIONS_STACK_OUTSET_RIGHT_PX = 22;
export const PRODUCT_CARD_ACTIONS_STACK_SHIFT_LEFT_PX = 3;
/** Extra CSS `right` on mobile 2-up grid — shifts heart/compare/discount left of the edge. */
export const PRODUCT_CARD_ACTIONS_STACK_MOBILE_GRID_EXTRA_RIGHT_PX = 14;

export const PRODUCT_CARD_CART_BUTTON_INSET_BOTTOM_PX = 5;
export const PRODUCT_CARD_CART_BUTTON_INSET_RIGHT_PX = 4;
export const PRODUCT_CARD_CART_BUTTON_SIZE_PX = 48;
export const PRODUCT_CARD_CART_FIGMA_ICON_WIDTH_PX = 19;
export const PRODUCT_CARD_CART_FIGMA_ICON_HEIGHT_PX = 19;
export const PRODUCT_CARD_CART_BUTTON_SPINNER_PX = 18;

export const PRODUCT_CARD_PRICE_FONT_SIZE_PX = 20;
export const PRODUCT_CARD_PRICE_LINE_HEIGHT_PX = 28;
export const PRODUCT_CARD_OLD_PRICE_FONT_SIZE_PX = 12;
export const PRODUCT_CARD_PRICE_ROW_END_PADDING_PX =
  PRODUCT_CARD_CART_BUTTON_SIZE_PX + 10;

/** Brand wordmark slot — matches marco.am special-offer cards. */
export const PRODUCT_CARD_BRAND_LOGO_HEIGHT_PX = 22;
export const PRODUCT_CARD_BRAND_LOGO_HEIGHT_DESKTOP_PX = 28;
export const PRODUCT_CARD_BRAND_LOGO_MAX_WIDTH_PX = 96;
export const PRODUCT_CARD_BRAND_LOGO_MAX_WIDTH_DESKTOP_PX = 108;
/** Desktop/default — lifts price off the card bottom / gap before brand. */
export const PRODUCT_CARD_PRICE_BLOCK_LIFT_FROM_BOTTOM_PX = 33;
/** Mobile 2-up — tighter gap between price and brand logo. */
export const PRODUCT_CARD_PRICE_TO_BRAND_GAP_MOBILE_PX = 12;
/** On mobile product cards — lift brand logo slightly above the card bottom edge. */
export const PRODUCT_CARD_BRAND_LOGO_LIFT_MOBILE_PX = 28;
/** On mobile 2-up cards — shift brand/title/price block down (translateY). */
export const PRODUCT_CARD_TEXT_SHIFT_DOWN_MOBILE_PX = 2;
/** Reserves 2 title lines + SKU so prices align across cards. */
export const PRODUCT_CARD_TITLE_BLOCK_HEIGHT_PX = 58;
export const PRODUCT_CARD_TITLE_TO_PRICE_GAP_PX = 8;
export const PRODUCT_CARD_BRAND_LOGO_SLOT_CLASS =
  "flex min-h-[22px] max-w-[96px] items-center overflow-visible md:min-h-7 md:max-w-[108px]";
export const PRODUCT_CARD_BRAND_LOGO_BOX_CLASS =
  "relative h-[22px] w-full max-w-[96px] shrink-0 md:h-7 md:max-w-[108px]";
export const PRODUCT_CARD_IMAGE_WELL_HEIGHT_PX = 177;
export const PRODUCT_CARD_IMAGE_RADIUS_PX = 19;
export const PRODUCT_CARD_IMAGE_WELL_RADIUS_CLASS =
  "max-md:rounded-none md:rounded-[19px]";
/** Warranty pill inset from card top — matches marco.am. */
export const PRODUCT_CARD_WARRANTY_INSET_TOP_PX = 6;
export const PRODUCT_CARD_WARRANTY_INSET_LEFT_PX = 12;
export const PRODUCT_CARD_WARRANTY_INSET_LEFT_MOBILE_GRID_PX = 6;
/** Vertical space between the product image well and the title block. */
export const PRODUCT_CARD_IMAGE_TO_TEXT_GAP_PX = 31;
export const PRODUCT_CARD_MOBILE_NOTCH_WIDTH_PX = 76;
export const PRODUCT_CARD_MOBILE_NOTCH_HEIGHT_PX = 38;
export const PRODUCT_CARD_MOBILE_NOTCH_TOP_RADIUS_PX = 38;
export const PRODUCT_CARD_CART_MOBILE_BOTTOM_PX = -26;
export const PRODUCT_CARD_RAIL_MOBILE_PADDING_BOTTOM_PX = 32;

/** Horizontal gap between the two columns in the mobile 2-up grid. */
export const PRODUCT_CARD_MOBILE_GRID_COLUMN_GAP_PX = 12;
/** Visual spacer between adjacent mobile snap pages. */
export const PRODUCT_CARD_MOBILE_RAIL_PAGE_GAP_PX = 10;

export const PRODUCT_CARD_SHELL_CLASS = "bg-marco-card";
export const PRODUCT_CARD_INK_CLASS = "product-card-price font-black";
export const PRODUCT_CARD_WISHLIST_CLASS =
  "flex h-8 w-8 items-center justify-center rounded-full bg-marco-slate text-white shadow-sm transition-[filter] hover:brightness-95 active:brightness-90";
export const PRODUCT_CARD_CART_CLASS =
  "bg-marco-yellow shadow-sm hover:scale-105 hover:bg-marco-yellow hover:brightness-95 active:scale-95";
export const PRODUCT_CARD_DISCOUNT_CLASS =
  "max-w-[88px] rounded-full bg-marco-yellow px-2 py-1 text-center text-[10px] font-bold leading-tight text-white";
