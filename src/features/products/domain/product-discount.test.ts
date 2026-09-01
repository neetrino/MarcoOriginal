import { describe, expect, it } from "vitest";

import {
  compareAtFromDiscountPercent,
  discountPercentFromCompareAt,
  resolveDisplayDiscountPercent,
} from "@/features/products/domain/product-discount";

describe("product discount percent", () => {
  it("derives compare-at from sale price and percent", () => {
    expect(compareAtFromDiscountPercent(45, 20)).toBe(56);
    expect(compareAtFromDiscountPercent(100, 0)).toBeNull();
    expect(compareAtFromDiscountPercent(0, 20)).toBeNull();
  });

  it("derives percent from sale and compare-at prices", () => {
    expect(discountPercentFromCompareAt(45, 56)).toBe(20);
    expect(discountPercentFromCompareAt(100, null)).toBe(0);
    expect(discountPercentFromCompareAt(100, 100)).toBe(0);
  });

  it("prefers explicit percent, otherwise derives for storefront badges", () => {
    expect(
      resolveDisplayDiscountPercent({
        priceAmount: 8_000,
        compareAtAmount: 10_000,
        discountPercent: 15,
      }),
    ).toBe(15);
    expect(
      resolveDisplayDiscountPercent({
        priceAmount: 8_000,
        compareAtAmount: 10_000,
        discountPercent: null,
      }),
    ).toBe(20);
    expect(
      resolveDisplayDiscountPercent({
        priceAmount: 8_000,
        compareAtAmount: null,
      }),
    ).toBeNull();
  });
});
