/** Formats a promo discount the same way as supersudo/promo-codes. */
export function formatPromoDiscount(
  discountType: string,
  discountValue: number,
  currencyLabel: string,
): string {
  if (discountType === "PERCENTAGE") {
    return `${discountValue}%`;
  }

  return `${discountValue.toLocaleString("en-US")} ${currencyLabel}`;
}
