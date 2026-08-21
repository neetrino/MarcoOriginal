import {
  Building2,
  Clapperboard,
  Mail,
  Scale,
  Tag,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

export type MobileDrawerNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

/**
 * Drawer links that are not already on the mobile floor nav (home / shop).
 */
export function buildMobileDrawerNavItems(
  locale: Locale,
  dictionary: Dictionary,
): MobileDrawerNavItem[] {
  return [
    { href: `/${locale}/compare`, label: dictionary.nav.compare, icon: Scale },
    { href: `/${locale}/brand`, label: dictionary.nav.brand, icon: Tag },
    { href: `/${locale}/about`, label: dictionary.nav.about, icon: Building2 },
    { href: `/${locale}/contact`, label: dictionary.nav.contact, icon: Mail },
    { href: `/${locale}/reels`, label: dictionary.nav.reels, icon: Clapperboard },
  ];
}

export function isMobileDrawerNavActive(
  pathname: string,
  href: string,
  locale: Locale,
): boolean {
  if (href === `/${locale}` || href === `/${locale}/`) {
    return pathname === `/${locale}` || pathname === `/${locale}/`;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}
