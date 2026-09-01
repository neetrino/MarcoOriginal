/** Shared storefront product tile — home, catalog, PDP related. */

export const PRODUCT_CARD_RADIUS_PX = 34;
export const PRODUCT_CARD_HEIGHT_PX = 420;
export const PRODUCT_CARD_CUTOUT_SIZE_PX = 96;
export const PRODUCT_CARD_CORNER_MASK_TRANSLATE_PERCENT = 24;
export const PRODUCT_CARD_MAX_WIDTH_PX = 272;
export const PRODUCT_CARD_PLP_MAX_WIDTH_PX = 306;
export const PRODUCT_CARD_MAX_WIDTH_CLASS = "max-w-[272px]";
export const PRODUCT_CARD_PLP_MAX_WIDTH_CLASS = "max-w-[306px]";

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

/** Brand wordmark slot — matches 3001 storefront cards. */
export const PRODUCT_CARD_BRAND_LOGO_HEIGHT_PX = 22;
export const PRODUCT_CARD_BRAND_LOGO_HEIGHT_DESKTOP_PX = 28;
export const PRODUCT_CARD_BRAND_LOGO_MAX_WIDTH_PX = 96;
export const PRODUCT_CARD_BRAND_LOGO_MAX_WIDTH_DESKTOP_PX = 108;
export const PRODUCT_CARD_PRICE_TO_BRAND_GAP_PX = 12;
/** Reserves 2 title lines + SKU so prices align across cards. */
export const PRODUCT_CARD_TITLE_BLOCK_HEIGHT_PX = 58;
export const PRODUCT_CARD_TITLE_TO_PRICE_GAP_PX = 8;
export const PRODUCT_CARD_BRAND_LOGO_SLOT_CLASS =
  "flex min-h-[22px] max-w-[96px] items-center overflow-visible md:min-h-7 md:max-w-[108px]";
export const PRODUCT_CARD_BRAND_LOGO_BOX_CLASS =
  "relative h-[22px] w-full max-w-[96px] shrink-0 md:h-7 md:max-w-[108px]";
export const PRODUCT_CARD_IMAGE_WELL_HEIGHT_PX = 218;
export const PRODUCT_CARD_IMAGE_RADIUS_PX = 26;
export const PRODUCT_CARD_IMAGE_TO_TEXT_GAP_PX = 14;
export const PRODUCT_CARD_MOBILE_NOTCH_WIDTH_PX = 76;
export const PRODUCT_CARD_MOBILE_NOTCH_HEIGHT_PX = 38;
export const PRODUCT_CARD_MOBILE_NOTCH_TOP_RADIUS_PX = 38;
export const PRODUCT_CARD_CART_MOBILE_BOTTOM_PX = -26;
export const PRODUCT_CARD_RAIL_MOBILE_PADDING_BOTTOM_PX = 32;

export const PRODUCT_CARD_SHELL_CLASS = "bg-marco-card";
export const PRODUCT_CARD_INK_CLASS = "product-card-price font-black";
export const PRODUCT_CARD_WISHLIST_CLASS =
  "flex h-8 w-8 items-center justify-center rounded-full bg-marco-slate text-white shadow-sm transition-[filter] hover:brightness-95 active:brightness-90";
export const PRODUCT_CARD_CART_CLASS =
  "bg-marco-yellow shadow-sm hover:scale-105 hover:bg-marco-yellow hover:brightness-95 active:scale-95";
export const PRODUCT_CARD_DISCOUNT_CLASS =
  "max-w-[88px] rounded-full bg-marco-yellow px-2 py-1 text-center text-[10px] font-bold leading-tight text-white";
