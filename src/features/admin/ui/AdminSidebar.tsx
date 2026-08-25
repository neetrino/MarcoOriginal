"use client";

import { usePathname } from "next/navigation";

import { AdminBrandMark } from "@/features/admin/ui/AdminBrandMark";
import { AdminMenuDrawer } from "@/features/admin/ui/AdminMenuDrawer";
import { AdminNavList } from "@/features/admin/ui/AdminNavList";
import { AdminSidebarBrand } from "@/features/admin/ui/AdminSidebarBrand";
import {
  ADMIN_SIDEBAR_ASIDE,
  ADMIN_SIDEBAR_MOBILE_BAR,
  ADMIN_SIDEBAR_NAV,
} from "@/features/admin/ui/admin-shell-classes";
import { getAdminCopy } from "@/features/admin/ui/get-admin-copy";

type AdminSidebarProps = {
  locale: string;
};

export function AdminSidebar({ locale }: AdminSidebarProps) {
  const pathname = usePathname() ?? `/${locale}/admin`;
  const nav = getAdminCopy(locale).nav;

  return (
    <>
      <div className={ADMIN_SIDEBAR_MOBILE_BAR}>
        <AdminBrandMark locale={locale} />
        <AdminMenuDrawer locale={locale} pathname={pathname} />
      </div>
      <aside className={`${ADMIN_SIDEBAR_ASIDE} lg:w-64`}>
        <AdminSidebarBrand locale={locale} />
        <nav className={`${ADMIN_SIDEBAR_NAV} px-2`} aria-label={nav.ariaLabel}>
          <AdminNavList locale={locale} pathname={pathname} />
        </nav>
      </aside>
    </>
  );
}
