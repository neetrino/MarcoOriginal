import { describe, expect, it } from "vitest";

import {
  adminNavGroupClass,
  adminNavIconClass,
  adminNavItemClass,
} from "@/features/admin/ui/admin-nav-classes";

describe("admin nav classes", () => {
  it("marks the active row with the storefront yellow pill", () => {
    const active = adminNavItemClass({ active: true, collapsed: false });
    const idle = adminNavItemClass({ active: false, collapsed: false });

    expect(active).toContain("bg-marco-yellow");
    expect(idle).not.toContain("bg-marco-yellow");
    expect(idle).toContain("hover:bg-white");
  });

  it("centers collapsed rows and indents product subpages", () => {
    const collapsed = adminNavItemClass({ active: false, collapsed: true });
    const nested = adminNavItemClass({
      active: false,
      collapsed: false,
      isSubCategory: true,
    });

    expect(collapsed).toContain("justify-center");
    expect(nested).toContain("pl-11");
  });

  it("keeps group and icon tones aligned with the active pill", () => {
    expect(adminNavGroupClass(true)).toContain("bg-marco-yellow");
    expect(adminNavIconClass(true)).toContain("text-marco-slate");
    expect(adminNavIconClass(false)).toContain("text-marco-slate/50");
  });
});
