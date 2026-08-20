import { describe, expect, it } from "vitest";

import {
  amdRangeToDisplayMajor,
  displayMajorRangeToAmd,
  formatCatalogFilterPrice,
  normalizeSelectedPriceRange,
} from "@/features/products/domain/catalog-price-bounds";

describe("catalog price bounds", () => {
  it("converts AMD bounds to USD major units", () => {
    expect(amdRangeToDisplayMajor(10_000, 1_913_462, "USD", "0.0026")).toEqual({
      minMajor: 26,
      maxMajor: 4975,
    });
  });

  it("converts display majors back to AMD", () => {
    expect(displayMajorRangeToAmd(26, 4975, "USD", "0.0026")).toEqual({
      minAmd: 10_000,
      maxAmd: 1_913_462,
    });
  });

  it("keeps AMD majors identical to base amounts", () => {
    expect(amdRangeToDisplayMajor(7, 4975, "AMD", "1")).toEqual({
      minMajor: 7,
      maxMajor: 4975,
    });
    expect(displayMajorRangeToAmd(7, 4975, "AMD", "1")).toEqual({
      minAmd: 7,
      maxAmd: 4975,
    });
  });

  it("formats screenshot-style labels and drops full-range URL params", () => {
    expect(formatCatalogFilterPrice(4975, "USD")).toBe("4,975 $");
    expect(
      normalizeSelectedPriceRange(7, 4975, { minMajor: 7, maxMajor: 4975 }),
    ).toEqual({ minPrice: null, maxPrice: null });
    expect(
      normalizeSelectedPriceRange(20, 100, { minMajor: 7, maxMajor: 4975 }),
    ).toEqual({ minPrice: 20, maxPrice: 100 });
  });
});
