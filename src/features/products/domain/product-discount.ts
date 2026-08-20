export const MAX_PRODUCT_DISCOUNT_PERCENT = 99;

/** Original (compare-at) price implied by a sale price and percent off. */
export function compareAtFromDiscountPercent(
  priceAmount: number,
  percent: number,
): number | null {
  if (!Number.isInteger(priceAmount) || priceAmount <= 0) return null;
  if (!Number.isInteger(percent) || percent <= 0 || percent >= 100) {
    return null;
  }
  return Math.round((priceAmount * 100) / (100 - percent));
}

/** Whole-number percent off implied by sale and compare-at prices. */
export function discountPercentFromCompareAt(
  priceAmount: number,
  compareAtAmount: number | null,
): number {
  if (
    compareAtAmount == null ||
    compareAtAmount <= priceAmount ||
    priceAmount <= 0
  ) {
    return 0;
  }
  return Math.min(
    MAX_PRODUCT_DISCOUNT_PERCENT,
    Math.round(((compareAtAmount - priceAmount) / compareAtAmount) * 100),
  );
}
