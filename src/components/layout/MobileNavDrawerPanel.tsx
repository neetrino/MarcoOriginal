"use client";

import { ChevronRight, X } from "lucide-react";

import { MobileNavDrawerCallFooter } from "@/components/layout/MobileNavDrawerCallFooter";
import {
  buildMobileDrawerNavItems,
  isMobileDrawerNavActive,
} from "@/components/layout/mobile-nav-drawer-items";
import {
  MOBILE_DRAWER_CLOSE_BTN_CLASS,
  MOBILE_DRAWER_CONTENT_MAX_CLASS,
  MOBILE_DRAWER_MENU_HEADER_ROW_CLASS,
  MOBILE_DRAWER_PANEL_CLASS,
  mobileDrawerNavPillClass,
} from "@/components/layout/mobile-nav-drawer.classes";
import { AppLink } from "@/components/ui/AppLink";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

type MobileNavDrawerPanelProps = {
  locale: Locale;
  dictionary: Dictionary;
  pathname: string;
  menuId: string;
  onClose: () => void;
};

function MobileDrawerNavList({
  locale,
  dictionary,
  pathname,
  onClose,
}: Omit<MobileNavDrawerPanelProps, "menuId">) {
  const items = buildMobileDrawerNavItems(locale, dictionary);

  return (
    <nav
      className="flex min-h-0 flex-1 flex-col justify-center gap-y-[clamp(0.3rem,1.1dvh,0.5rem)] overflow-y-auto overscroll-y-contain pb-2"
      aria-label={dictionary.nav.navigation}
    >
      {items.map((item) => {
        const active = isMobileDrawerNavActive(pathname, item.href, locale);
        const Icon = item.icon;
        return (
          <AppLink
            key={item.href}
            href={item.href}
            prefetchPolicy="intent"
            aria-current={active ? "page" : undefined}
            className={mobileDrawerNavPillClass(active)}
            onClick={onClose}
          >
            <span className="flex min-w-0 flex-1 items-center gap-3.5">
              <Icon className="h-6 w-6 shrink-0" strokeWidth={2} aria-hidden />
              <span className="truncate">{item.label}</span>
            </span>
            <ChevronRight className="h-5 w-5 shrink-0 opacity-50" aria-hidden />
          </AppLink>
        );
      })}
    </nav>
  );
}

export function MobileNavDrawerPanel({
  locale,
  dictionary,
  pathname,
  menuId,
  onClose,
}: MobileNavDrawerPanelProps) {
  return (
    <div
      id={menuId}
      role="dialog"
      aria-modal="true"
      aria-label={dictionary.nav.navigation}
      className={`pointer-events-auto fixed inset-0 z-[200] min-[1180px]:hidden ${MOBILE_DRAWER_PANEL_CLASS}`}
    >
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden px-3 min-[400px]:px-4">
        <div className="flex min-h-0 flex-1 flex-col gap-y-[clamp(0.35rem,1.2dvh,0.75rem)] pb-2 text-marco-black">
          <div className={MOBILE_DRAWER_MENU_HEADER_ROW_CLASS}>
            <button
              type="button"
              onClick={onClose}
              className={MOBILE_DRAWER_CLOSE_BTN_CLASS}
              aria-label={dictionary.nav.closeMenu}
            >
              <X className="h-6 w-6" strokeWidth={2} aria-hidden />
            </button>
          </div>
          <div
            className={`${MOBILE_DRAWER_CONTENT_MAX_CLASS} flex min-h-0 flex-1 flex-col`}
          >
            <MobileDrawerNavList
              locale={locale}
              dictionary={dictionary}
              pathname={pathname}
              onClose={onClose}
            />
            <MobileNavDrawerCallFooter
              locale={locale}
              dictionary={dictionary}
              onClose={onClose}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
