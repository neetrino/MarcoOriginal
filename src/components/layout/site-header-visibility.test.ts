import { describe, expect, it } from "vitest";

import { shouldHideSiteHeader } from "@/components/layout/site-header-visibility";

describe("shouldHideSiteHeader", () => {
  it("hides the storefront header on profile and admin routes", () => {
    expect(shouldHideSiteHeader("/hy/profile")).toBe(true);
    expect(shouldHideSiteHeader("/en/profile/orders")).toBe(true);
    expect(shouldHideSiteHeader("/ru/admin")).toBe(true);
    expect(shouldHideSiteHeader("/hy/admin/products")).toBe(true);
  });

  it("keeps the storefront header on catalog and auth routes", () => {
    expect(shouldHideSiteHeader("/hy")).toBe(false);
    expect(shouldHideSiteHeader("/en/products")).toBe(false);
    expect(shouldHideSiteHeader("/ru/login")).toBe(false);
    expect(shouldHideSiteHeader("/hy/checkout")).toBe(false);
  });
});
