"use client";

import { usePathname } from "next/navigation";

import { headerPrimaryNavClass } from "@/components/layout/site-header-classes";
import { AppLink } from "@/components/ui/AppLink";
import type { Locale } from "@/lib/i18n/config";

export type HeaderNavItem = {
  href: string;
  label: string;
};

type HeaderPrimaryNavProps = {
  locale: Locale;
  items: readonly HeaderNavItem[];
  ariaLabel: string;
};

function isNavItemActive(
  pathname: string,
  href: string,
  locale: Locale,
): boolean {
  if (href === `/${locale}` || href === `/${locale}/`) {
    return pathname === `/${locale}` || pathname === `/${locale}/`;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function HeaderPrimaryNav({
  locale,
  items,
  ariaLabel,
}: HeaderPrimaryNavProps) {
  const pathname = usePathname() ?? `/${locale}`;

  return (
    <nav
      aria-label={ariaLabel}
      className="flex h-10 shrink-0 flex-nowrap items-center gap-x-7 text-xs font-bold min-[1367px]:gap-x-[45px]"
    >
      {items.map((item) => {
        const active = isNavItemActive(pathname, item.href, locale);
        return (
          <AppLink
            key={item.href}
            href={item.href}
            prefetchPolicy="intent"
            className={headerPrimaryNavClass(active)}
            aria-current={active ? "page" : undefined}
          >
            {item.label}
          </AppLink>
        );
      })}
    </nav>
  );
}
