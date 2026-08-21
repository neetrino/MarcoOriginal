import { describe, expect, it } from "vitest";

import {
  draftsFromPercents,
  parseDiscountPercent,
} from "@/features/promotions/ui/discount-percent";

describe("parseDiscountPercent", () => {
  it("treats blank as cleared", () => {
    expect(parseDiscountPercent("")).toBeNull();
    expect(parseDiscountPercent("  ")).toBeNull();
  });

  it("accepts whole percents from 1 to 100", () => {
    expect(parseDiscountPercent("1")).toBe(1);
    expect(parseDiscountPercent("50")).toBe(50);
    expect(parseDiscountPercent("100")).toBe(100);
  });

  it("rejects non-integers and out-of-range values", () => {
    expect(parseDiscountPercent("0")).toBe("invalid");
    expect(parseDiscountPercent("10.5")).toBe("invalid");
    expect(parseDiscountPercent("101")).toBe("invalid");
    expect(parseDiscountPercent("abc")).toBe("invalid");
  });
});

describe("draftsFromPercents", () => {
  it("maps saved percents to input strings", () => {
    expect(
      draftsFromPercents([
        { id: "a", discountPercent: 15 },
        { id: "b", discountPercent: null },
      ]),
    ).toEqual({ a: "15", b: "" });
  });
});
