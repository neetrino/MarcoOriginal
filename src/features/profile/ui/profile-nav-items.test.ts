import { describe, expect, it } from "vitest";

import { getDictionary } from "@/lib/i18n/get-dictionary";
import {
  buildProfileNavItems,
  getProfileSectionTitle,
  isProfileNavItemActive,
} from "@/features/profile/ui/profile-nav-items";

describe("profile nav items", () => {
  const dictionary = getDictionary("hy").profile;
  const items = buildProfileNavItems("hy", dictionary);

  it("keeps dashboard first and delete-account last", () => {
    expect(items[0]?.id).toBe("dashboard");
    expect(items.at(-1)?.id).toBe("deleteAccount");
    expect(items.at(-1)?.danger).toBe(true);
  });

  it("matches exact dashboard and nested order routes", () => {
    const dashboard = items[0];
    const orders = items[1];
    expect(dashboard).toBeDefined();
    expect(orders).toBeDefined();
    if (!dashboard || !orders) return;

    expect(isProfileNavItemActive("/hy/profile", dashboard)).toBe(true);
    expect(isProfileNavItemActive("/hy/profile/orders", dashboard)).toBe(false);
    expect(isProfileNavItemActive("/hy/profile/orders/123", orders)).toBe(true);
  });

  it("resolves the sheet title from the active section", () => {
    expect(getProfileSectionTitle("/hy/profile/password", items, "Profile")).toBe(
      dictionary.password,
    );
  });
});
