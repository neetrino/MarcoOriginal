import { describe, expect, it } from "vitest";

import {
  DEFAULT_PRODUCT_STOCK,
  restockIfAtThreshold,
} from "@/features/products/domain/product-stock";

describe("restockIfAtThreshold", () => {
  it("refills to 1000 when remaining stock is 100 or less", () => {
    expect(restockIfAtThreshold(100)).toBe(DEFAULT_PRODUCT_STOCK);
    expect(restockIfAtThreshold(99)).toBe(DEFAULT_PRODUCT_STOCK);
    expect(restockIfAtThreshold(0)).toBe(DEFAULT_PRODUCT_STOCK);
  });

  it("keeps stock above the restock point", () => {
    expect(restockIfAtThreshold(101)).toBe(101);
    expect(restockIfAtThreshold(1000)).toBe(1000);
  });
});
