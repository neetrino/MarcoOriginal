import { describe, expect, it } from "vitest";

import { buildMobileDrawerNavItems } from "@/components/layout/mobile-nav-drawer-items";
import { getDictionary } from "@/lib/i18n/get-dictionary";

describe("buildMobileDrawerNavItems", () => {
  it("omits home and shop and keeps compare first", () => {
    const items = buildMobileDrawerNavItems("hy", getDictionary("hy"));

    expect(items.map((item) => item.href)).toEqual([
      "/hy/compare",
      "/hy/brand",
      "/hy/about",
      "/hy/contact",
      "/hy/reels",
    ]);
    expect(items[0]?.label).toBe("Համեմատել");
  });
});
