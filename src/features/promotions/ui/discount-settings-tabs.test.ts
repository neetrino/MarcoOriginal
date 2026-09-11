import { describe, expect, it } from "vitest";

import {
  DISCOUNT_TAB_IDS,
  isDiscountSettingsTab,
} from "@/features/promotions/ui/discount-settings-tabs";

describe("discount settings tabs", () => {
  it("includes brand alongside global, category, and product tabs", () => {
    expect(DISCOUNT_TAB_IDS).toEqual([
      "global",
      "category",
      "brand",
      "product",
    ]);
    expect(isDiscountSettingsTab("global")).toBe(true);
    expect(isDiscountSettingsTab("brand")).toBe(true);
    expect(isDiscountSettingsTab("coupon")).toBe(false);
  });
});
