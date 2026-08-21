import { describe, expect, it } from "vitest";

import { getDictionary } from "@/lib/i18n/get-dictionary";

describe("getDictionary", () => {
  it("merges namespace files into the storefront dictionary shape", () => {
    const dictionary = getDictionary("en");

    expect(dictionary.brand).toBe("MARCO");
    expect(dictionary.nav.home).toBe("Home");
    expect(dictionary.nav.brand).toBe("Brands");
    expect(dictionary.nav.reels).toBe("Reels");
    expect(dictionary.nav.stores).toBe("Stores");
    expect(dictionary.catalog.sortLabel).toBe("Sort");
    expect(dictionary.catalog.withPrice).toBe("With price");
    expect(dictionary.home.title).toBe("White Shop");
    expect(dictionary.contact.title).toBe("CONTACT US");
    expect(dictionary.contact.drawerCall.cta).toBe("Call");
    expect(dictionary.nav.menuCopyright).toContain("MARCO GROUP");
    expect(dictionary.cartDrawer.title).toBe("My Cart");
    expect(dictionary.checkout.title).toBe("Checkout");
    expect(dictionary.checkout.coupon.title).toBe("Promo code");
    expect(dictionary.checkout.form.notes).toBe("Order notes (optional)");
    expect(dictionary.wishlist.title).toBe("My Wishlist");
    expect(dictionary.wishlist.browseProducts).toBe("Browse Products");
    expect(dictionary.profile.savedAddresses).toBe("Saved addresses");
    expect(dictionary.profile.closeSheet).toBe("Close");
    expect(dictionary.admin.nav.dashboard).toBe("Dashboard");
    expect(dictionary.admin.dashboard.title).toBe("Admin Page");
    expect(dictionary.admin.products.title).toBe("Products");
  });

  it("loads Armenian and Russian namespaces", () => {
    expect(getDictionary("hy").nav.home).toBe("Գլխավոր");
    expect(getDictionary("ru").nav.home).toBe("Главная");
    expect(getDictionary("hy").admin.nav.dashboard).toBe("Վահանակ");
    expect(getDictionary("ru").admin.nav.dashboard).toBe("Панель");
    expect(getDictionary("hy").admin.dashboard.title).toBe("Ադմին էջ");
    expect(getDictionary("ru").admin.orders.title).toBe("Заказы");
  });

  it("exposes storefront auth form copy", () => {
    expect(getDictionary("hy").auth.signUp).toBe("Գրանցվել");
    expect(getDictionary("en").auth.noAccount).toBe("Don't have an account?");
    expect(getDictionary("ru").auth.submitLogin).toBe("Войти");
  });
});
