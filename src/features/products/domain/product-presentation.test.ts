import { describe, expect, it } from "vitest";

import {
  contrastTextOnHex,
  isProductSalesClass,
  isProductWarrantyYears,
  parseProductTags,
  productTagLabel,
} from "@/features/products/domain/product-presentation";

describe("product presentation", () => {
  it("accepts sales class and warranty year values", () => {
    expect(isProductSalesClass("RETAIL")).toBe(true);
    expect(isProductSalesClass("WHOLESALE")).toBe(true);
    expect(isProductSalesClass("BOTH")).toBe(false);
    expect(isProductWarrantyYears(0)).toBe(true);
    expect(isProductWarrantyYears(3)).toBe(true);
    expect(isProductWarrantyYears(4)).toBe(false);
  });

  it("parses valid tags and drops empty or invalid ones", () => {
    expect(
      parseProductTags([
        { id: "a", type: "TEXT", value: "  Նոր ապրանք  ", color: "#ffca03" },
        { id: "b", type: "PERCENT", value: "50", color: null },
        { id: "c", type: "PERCENT", value: "0", color: null },
        { id: "d", type: "TEXT", value: "   ", color: "red" },
        { type: "TEXT", value: "Sale" },
      ]),
    ).toEqual([
      { id: "a", type: "TEXT", value: "Նոր ապրանք", color: "#FFCA03" },
      { id: "b", type: "PERCENT", value: "50", color: null },
    ]);
  });

  it("picks contrasting badge text and percent labels", () => {
    expect(contrastTextOnHex("#FFCA03")).toBe("#111827");
    expect(contrastTextOnHex("#111827")).toBe("#FFFFFF");
    expect(
      productTagLabel({
        id: "1",
        type: "PERCENT",
        value: "50",
        color: null,
      }),
    ).toBe("50%");
  });
});
