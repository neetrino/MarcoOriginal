import { describe, expect, it } from "vitest";

import {
  PRODUCT_DISCOUNT_PAGE_SIZE,
  paginateDiscountItems,
} from "@/features/promotions/ui/discount-product-page";

describe("paginateDiscountItems", () => {
  const items = Array.from({ length: 25 }, (_, index) => index + 1);

  it("slices the first page of 12", () => {
    const result = paginateDiscountItems(items, 1);
    expect(result.totalPages).toBe(3);
    expect(result.items).toEqual(items.slice(0, PRODUCT_DISCOUNT_PAGE_SIZE));
  });

  it("clamps an out-of-range page", () => {
    expect(paginateDiscountItems(items, 99).page).toBe(3);
    expect(paginateDiscountItems(items, 0).page).toBe(1);
  });
});
