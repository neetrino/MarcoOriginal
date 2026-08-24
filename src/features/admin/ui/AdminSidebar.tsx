"use client";

import { usePathname } from "next/navigation";

import { AdminBrandMark } from "@/features/admin/ui/AdminBrandMark";
import { AdminMenuDrawer } from "@/features/admin/ui/AdminMenuDrawer";
import { AdminNavList } from "@/features/admin/ui/AdminNavList";
import { AdminSidebarBrand } from "@/features/admin/ui/AdminSidebarBrand";
import { useAdminSidebarCollapse } from "@/features/admin/ui/AdminSidebarCollapseContext";
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
  const { collapsed } = useAdminSidebarCollapse();
  const asideWidthClass = collapsed ? "lg:w-16" : "lg:w-64";
  const nav = getAdminCopy(locale).nav;

  return (
    <>
      <div className={ADMIN_SIDEBAR_MOBILE_BAR}>
        <AdminBrandMark locale={locale} />
        <AdminMenuDrawer locale={locale} pathname={pathname} />
      </div>
      <aside className={`${ADMIN_SIDEBAR_ASIDE} ${asideWidthClass}`}>
        <AdminSidebarBrand locale={locale} />
        <nav
          className={`${ADMIN_SIDEBAR_NAV} ${collapsed ? "px-1" : "px-2"}`}
          aria-label={nav.ariaLabel}
        >
          <AdminNavList
            locale={locale}
            pathname={pathname}
            collapsed={collapsed}
          />
        </nav>
      </aside>
    </>
  );
}
