"use client";

import { useId } from "react";
import { createPortal } from "react-dom";
import { Menu } from "lucide-react";

import { MobileNavDrawerPanel } from "@/components/layout/MobileNavDrawerPanel";
import { useMobileNavDrawer } from "@/components/layout/use-mobile-nav-drawer";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { useIsClient } from "@/lib/react/use-is-client";

type MobileNavDrawerProps = {
  locale: Locale;
  dictionary: Dictionary;
  triggerClassName?: string;
};

/**
 * Full-viewport mobile navigate menu — pill rows, socials, and call flow
 * matching the marco.am hamburger sheet.
 */
export function MobileNavDrawer({
  locale,
  dictionary,
  triggerClassName,
}: MobileNavDrawerProps) {
  const menuId = useId();
  const mounted = useIsClient();
  const { open, pathname, closeMenu, toggleMenu } = useMobileNavDrawer();

  return (
    <>
      <button
        type="button"
        onClick={toggleMenu}
        className={
          triggerClassName ??
          "relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-900 text-white transition-opacity hover:opacity-80 touch-manipulation sm:h-10 sm:w-10"
        }
        aria-label={open ? dictionary.nav.closeMenu : dictionary.nav.openMenu}
        aria-expanded={open}
        aria-controls={menuId}
      >
        <Menu className="h-6 w-6" strokeWidth={2.25} aria-hidden="true" />
      </button>

      {mounted && open
        ? createPortal(
            <MobileNavDrawerPanel
              locale={locale}
              dictionary={dictionary}
              pathname={pathname}
              menuId={menuId}
              onClose={closeMenu}
            />,
            document.body,
          )
        : null}
    </>
  );
}
