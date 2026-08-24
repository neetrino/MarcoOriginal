import { describe, expect, it } from "vitest";

import {
  getAdminMenuItems,
  isAdminTabActive,
} from "@/features/admin/ui/admin-menu.config";

describe("admin menu config", () => {
  it("keeps the approved sidebar order", () => {
    expect(getAdminMenuItems("hy").map((item) => item.id)).toEqual([
      "home",
      "dashboard",
      "hero",
      "orders",
      "products",
      "categories",
      "brands",
      "attributes",
      "coupons",
      "discounts",
      "users",
      "reels",
      "messages",
      "analytics",
      "delivery",
      "blog",
      "settings",
    ]);
  });

  it("does not mark storefront home active on admin routes", () => {
    expect(isAdminTabActive("/hy", "/hy/admin", "hy")).toBe(false);
    expect(isAdminTabActive("/hy", "/hy", "hy")).toBe(true);
    expect(isAdminTabActive("/hy/admin", "/hy/admin", "hy")).toBe(true);
    expect(isAdminTabActive("/hy/admin", "/hy/admin/orders", "hy")).toBe(false);
  });
});
