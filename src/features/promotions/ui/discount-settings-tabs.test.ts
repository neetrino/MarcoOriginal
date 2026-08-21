import { describe, expect, it } from "vitest";

import {
  DISCOUNT_TAB_IDS,
  isDiscountSettingsTab,
} from "@/features/promotions/ui/discount-settings-tabs";

describe("discount settings tabs", () => {
  it("accepts the supersudo board tabs that this project can persist", () => {
    expect(DISCOUNT_TAB_IDS).toEqual(["global", "category", "product"]);
    expect(isDiscountSettingsTab("global")).toBe(true);
    expect(isDiscountSettingsTab("brand")).toBe(false);
  });
});
