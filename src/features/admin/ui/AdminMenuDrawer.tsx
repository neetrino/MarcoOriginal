"use client";

import { useState } from "react";

import { HEADER_MOBILE_ROUND_CONTROL_CLASS } from "@/components/layout/site-header-classes";
import { SideSheet } from "@/components/ui/SideSheet";
import { AdminBrandMark } from "@/features/admin/ui/AdminBrandMark";
import { AdminNavList } from "@/features/admin/ui/AdminNavList";
import { getAdminCopy } from "@/features/admin/ui/get-admin-copy";

type AdminMenuDrawerProps = {
  locale: string;
  pathname: string;
};

export function AdminMenuDrawer({ locale, pathname }: AdminMenuDrawerProps) {
  const [open, setOpen] = useState(false);
  const nav = getAdminCopy(locale).nav;

  function close(): void {
    setOpen(false);
  }

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="admin-menu-drawer-panel"
        onClick={() => setOpen((prev) => !prev)}
        className={HEADER_MOBILE_ROUND_CONTROL_CLASS}
      >
        <span className="sr-only">{nav.openMenu}</span>
        <svg
          className="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6H20M4 12H16M4 18H12"
          />
        </svg>
      </button>

      <SideSheet
        open={open}
        onClose={close}
        ariaLabel={nav.menuAria}
        side="left"
        panelClassName="w-[min(20rem,88vw)] max-w-full bg-marco-gray"
      >
        <div
          id="admin-menu-drawer-panel"
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="border-b border-gray-200 bg-white px-4 py-4">
            <AdminBrandMark locale={locale} onNavigate={close} />
          </div>

          <nav
            className="flex-1 space-y-1 overflow-y-auto px-3 py-4"
            aria-label={nav.ariaLabel}
          >
            <AdminNavList
              locale={locale}
              pathname={pathname}
              onNavigate={close}
            />
          </nav>
        </div>
      </SideSheet>
    </div>
  );
}
