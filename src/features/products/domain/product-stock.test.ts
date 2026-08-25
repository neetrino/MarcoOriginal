import { describe, expect, it } from "vitest";

import {
  DEFAULT_PRODUCT_STOCK,
  restockIfAtThreshold,
} from "@/features/products/domain/product-stock";

describe("restockIfAtThreshold", () => {
  it("refills to 10000 when remaining stock is 1000 or less", () => {
    expect(restockIfAtThreshold(1000)).toBe(DEFAULT_PRODUCT_STOCK);
    expect(restockIfAtThreshold(999)).toBe(DEFAULT_PRODUCT_STOCK);
    expect(restockIfAtThreshold(0)).toBe(DEFAULT_PRODUCT_STOCK);
  });

  it("keeps stock above the restock point", () => {
    expect(restockIfAtThreshold(1001)).toBe(1001);
    expect(restockIfAtThreshold(10000)).toBe(10000);
  });
});
