import { describe, expect, it } from "vitest";

import { formatPromoDiscount } from "@/features/promotions/ui/admin-coupons-display";

describe("formatPromoDiscount", () => {
  it("renders a percent discount", () => {
    expect(formatPromoDiscount("PERCENTAGE", 15, "AMD")).toBe("15%");
  });

  it("renders a fixed amount with a thousands separator", () => {
    expect(formatPromoDiscount("FIXED", 5000, "AMD")).toBe("5,000 AMD");
  });
});
