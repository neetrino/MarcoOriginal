import { describe, expect, it } from "vitest";

import {
  DISCOUNT_BOARD_CARD,
  DISCOUNT_GLOBAL_CARD,
  DISCOUNT_TAB_ACTIVE,
  discountTabClass,
} from "@/features/promotions/ui/discount-admin.classes";

describe("discount admin classes", () => {
  it("marks the active tab with marco yellow", () => {
    expect(discountTabClass(true)).toContain(DISCOUNT_TAB_ACTIVE);
    expect(discountTabClass(true)).toContain("bg-marco-yellow");
    expect(discountTabClass(false)).not.toContain("bg-marco-yellow");
  });

  it("keeps the supersudo board and global card surfaces", () => {
    expect(DISCOUNT_BOARD_CARD).toContain("from-white");
    expect(DISCOUNT_GLOBAL_CARD).toContain("from-rose-50");
  });
});
