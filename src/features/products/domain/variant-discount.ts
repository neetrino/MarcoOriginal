import {
  compareAtFromDiscountPercent,
  discountPercentFromCompareAt,
  MAX_PRODUCT_DISCOUNT_PERCENT,
} from "@/features/products/domain/product-discount";

export const VARIANT_DISCOUNT_TYPES = ["PERCENTAGE", "FIXED"] as const;

export type VariantDiscountType = (typeof VARIANT_DISCOUNT_TYPES)[number];

export function isVariantDiscountType(
  value: string,
): value is VariantDiscountType {
  return (VARIANT_DISCOUNT_TYPES as readonly string[]).includes(value);
}

/** Compare-at price implied by a variant sale price and discount settings. */
export function compareAtFromVariantDiscount(
  priceAmount: number,
  discountType: VariantDiscountType | null,
  discountValue: number,
): number | null {
  if (!Number.isInteger(priceAmount) || priceAmount <= 0) return null;
  if (!discountType || !Number.isInteger(discountValue) || discountValue <= 0) {
    return null;
  }

  if (discountType === "FIXED") {
    return priceAmount + discountValue;
  }

  if (discountValue >= 100) return null;
  return compareAtFromDiscountPercent(priceAmount, discountValue);
}

/** Discount UI fields derived from stored compare-at or explicit discount. */
export function variantDiscountFromStored(
  priceAmount: number,
  compareAtAmount: number | null,
  discountType: VariantDiscountType | null,
  discountValue: number | null,
): { discountType: VariantDiscountType; discountValue: string } {
  if (discountType === "FIXED" && discountValue != null && discountValue > 0) {
    return {
      discountType: "FIXED",
      discountValue: String(discountValue),
    };
  }

  if (discountType === "PERCENTAGE" && discountValue != null && discountValue > 0) {
    return {
      discountType: "PERCENTAGE",
      discountValue: String(
        Math.min(MAX_PRODUCT_DISCOUNT_PERCENT, discountValue),
      ),
    };
  }

  return {
    discountType: "PERCENTAGE",
    discountValue: String(
      discountPercentFromCompareAt(priceAmount, compareAtAmount),
    ),
  };
}
