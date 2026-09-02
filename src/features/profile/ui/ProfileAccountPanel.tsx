"use client";

import { ChevronRight, Home, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";

import { AppLink } from "@/components/ui/AppLink";
import { logoutAction } from "@/features/auth/logout-action";
import { ProfileNavIcon } from "@/features/profile/ui/profile-nav-icons";
import {
  buildProfileNavItems,
  isProfileNavItemActive,
  type ProfileNavItem,
} from "@/features/profile/ui/profile-nav-items";
import { ProfileUserCard } from "@/features/profile/ui/ProfileUserCard";
import {
  PROFILE_LOGOUT_BUTTON_CLASS,
  PROFILE_NAV_ITEM_ACTIVE_CLASS,
  PROFILE_NAV_ITEM_BASE_CLASS,
  PROFILE_NAV_ITEM_DANGER_CLASS,
  PROFILE_NAV_ITEM_IDLE_CLASS,
  PROFILE_NAV_SHELL_CLASS,
} from "@/features/profile/ui/profile-surface-classes";
import type { SessionUser } from "@/lib/auth/session";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

type ProfileAccountPanelProps = {
  locale: Locale;
  user: SessionUser;
  dictionary: Dictionary["profile"];
  homeLabel: string;
  variant: "desktop" | "mobile";
};

function navItemClassName(item: ProfileNavItem, active: boolean): string {
  if (active) {
    return `${PROFILE_NAV_ITEM_BASE_CLASS} ${PROFILE_NAV_ITEM_ACTIVE_CLASS}`;
  }
  if (item.danger) {
    return `${PROFILE_NAV_ITEM_BASE_CLASS} ${PROFILE_NAV_ITEM_DANGER_CLASS}`;
  }
  return `${PROFILE_NAV_ITEM_BASE_CLASS} ${PROFILE_NAV_ITEM_IDLE_CLASS}`;
}

function iconClassName(item: ProfileNavItem, active: boolean): string {
  if (active) return "text-[#8c6500]";
  if (item.danger) return "text-red-600";
  return "text-marco-slate";
}

function chevronClassName(item: ProfileNavItem, active: boolean): string {
  if (active) return "h-4 w-4 text-[#8c6500]";
  if (item.danger) return "h-4 w-4 text-red-400";
  return "h-4 w-4 text-marco-slate/45";
}

export function ProfileAccountPanel({
  locale,
  user,
  dictionary,
  homeLabel,
  variant,
}: ProfileAccountPanelProps) {
  const pathname = usePathname() ?? "";
  const logoutWithLocale = logoutAction.bind(null, locale);
  const items = buildProfileNavItems(locale, dictionary).filter(
    (item) => variant === "desktop" || item.id !== "dashboard",
  );

  return (
    <div className="flex w-full flex-col gap-1.5 lg:gap-3">
      <ProfileUserCard user={user} title={dictionary.title} />

      <nav className={PROFILE_NAV_SHELL_CLASS} aria-label={dictionary.title}>
        <div className="mb-1.5 rounded-xl border border-slate-200/80 bg-marco-gray/80 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
          <AppLink
            href={`/${locale}`}
            prefetchPolicy="intent"
            className={`${PROFILE_NAV_ITEM_BASE_CLASS} ${PROFILE_NAV_ITEM_IDLE_CLASS}`}
          >
            <Home className="h-5 w-5 text-marco-slate" aria-hidden />
            <span className="flex-1">{homeLabel}</span>
            <ChevronRight className="h-4 w-4 text-marco-slate/45" aria-hidden />
          </AppLink>
        </div>
        <div className="mb-2 border-b border-slate-200/80" />

        <div className="flex flex-col gap-1.5">
          {items.map((item) => {
            const active = isProfileNavItemActive(pathname, item);
            return (
              <AppLink
                key={item.id}
                href={item.href}
                prefetchPolicy="intent"
                aria-current={active ? "page" : undefined}
                className={navItemClassName(item, active)}
              >
                <span className={iconClassName(item, active)}>
                  <ProfileNavIcon id={item.id} />
                </span>
                <span className="flex-1">{item.label}</span>
                <ChevronRight
                  className={chevronClassName(item, active)}
                  aria-hidden
                />
              </AppLink>
            );
          })}
        </div>
      </nav>

      <form action={logoutWithLocale}>
        <button type="submit" className={PROFILE_LOGOUT_BUTTON_CLASS}>
          <LogOut className="h-5 w-5 text-marco-slate" aria-hidden />
          <span>{dictionary.logout}</span>
        </button>
      </form>
    </div>
  );
}
