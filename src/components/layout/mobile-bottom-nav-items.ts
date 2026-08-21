import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

export type NavSlot = "home" | "shop" | "wishlist" | "cart" | "profile";

export type FloorNavItem = {
  id: NavSlot;
  href: string;
  label: string;
  match: (pathname: string) => boolean;
};

export function isHomePath(pathname: string, locale: Locale): boolean {
  return pathname === `/${locale}` || pathname === `/${locale}/`;
}

export function startsWithPath(pathname: string, base: string): boolean {
  return pathname === base || pathname.startsWith(`${base}/`);
}

export function buildFloorNavItems(
  locale: Locale,
  dictionary: Dictionary,
  profileHref: string,
): {
  home: FloorNavItem;
  wishlist: FloorNavItem;
  shop: FloorNavItem;
  profile: FloorNavItem;
} {
  return {
    home: {
      id: "home",
      href: `/${locale}`,
      label: dictionary.nav.home,
      match: (path) => isHomePath(path, locale),
    },
    wishlist: {
      id: "wishlist",
      href: `/${locale}/wishlist`,
      label: dictionary.nav.wishlist,
      match: (path) => startsWithPath(path, `/${locale}/wishlist`),
    },
    shop: {
      id: "shop",
      href: `/${locale}/products`,
      label: dictionary.nav.shop,
      match: (path) => startsWithPath(path, `/${locale}/products`),
    },
    profile: {
      id: "profile",
      href: profileHref,
      label: dictionary.header.profile,
      match: (path) =>
        startsWithPath(path, `/${locale}/profile`) ||
        startsWithPath(path, `/${locale}/login`),
    },
  };
}
