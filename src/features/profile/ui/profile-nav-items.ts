import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

export type ProfileNavId =
  | "dashboard"
  | "orders"
  | "personal"
  | "addresses"
  | "password"
  | "deleteAccount";

export type ProfileNavItem = {
  id: ProfileNavId;
  href: string;
  label: string;
  exact?: boolean;
  danger?: boolean;
};

export function buildProfileNavItems(
  locale: Locale,
  dictionary: Dictionary["profile"],
): ProfileNavItem[] {
  return [
    {
      id: "dashboard",
      href: `/${locale}/profile`,
      label: dictionary.dashboard,
      exact: true,
    },
    {
      id: "orders",
      href: `/${locale}/profile/orders`,
      label: dictionary.orders,
    },
    {
      id: "personal",
      href: `/${locale}/profile/personal-information`,
      label: dictionary.personal,
    },
    {
      id: "addresses",
      href: `/${locale}/profile/addresses`,
      label: dictionary.addresses,
    },
    {
      id: "password",
      href: `/${locale}/profile/password`,
      label: dictionary.password,
    },
    {
      id: "deleteAccount",
      href: `/${locale}/profile/delete-account`,
      label: dictionary.deleteAccount,
      danger: true,
    },
  ];
}

export function isProfileNavItemActive(
  pathname: string,
  item: ProfileNavItem,
): boolean {
  if (item.exact) {
    return pathname === item.href || pathname === `${item.href}/`;
  }
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function getProfileSectionTitle(
  pathname: string,
  items: ProfileNavItem[],
  fallback: string,
): string {
  const match = items.find((item) => isProfileNavItemActive(pathname, item));
  return match?.label ?? fallback;
}
