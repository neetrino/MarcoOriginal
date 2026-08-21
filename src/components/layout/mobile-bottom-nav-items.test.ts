import { describe, expect, it } from "vitest";

import { buildFloorNavItems } from "@/components/layout/mobile-bottom-nav-items";
import { getDictionary } from "@/lib/i18n/get-dictionary";

describe("buildFloorNavItems", () => {
  it("places home and wishlist on the left and shop in the center slot", () => {
    const items = buildFloorNavItems("hy", getDictionary("hy"), "/hy/profile");

    expect(items.home.href).toBe("/hy");
    expect(items.wishlist.href).toBe("/hy/wishlist");
    expect(items.shop.href).toBe("/hy/products");
    expect(items.profile.href).toBe("/hy/profile");
  });
});
