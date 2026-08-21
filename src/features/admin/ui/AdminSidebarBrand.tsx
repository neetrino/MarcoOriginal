"use client";

import { AdminBrandMark } from "@/features/admin/ui/AdminBrandMark";
import { useAdminSidebarCollapse } from "@/features/admin/ui/AdminSidebarCollapseContext";
import { getAdminCopy } from "@/features/admin/ui/get-admin-copy";

type AdminSidebarBrandProps = {
  locale: string;
};

export function AdminSidebarBrand({ locale }: AdminSidebarBrandProps) {
  const { collapsed, toggleCollapsed } = useAdminSidebarCollapse();
  const nav = getAdminCopy(locale).nav;
  const collapseLabel = collapsed ? nav.expandSidebar : nav.collapseSidebar;

  return (
    <div
      className={`flex shrink-0 border-b border-gray-200 pb-3 pt-3 ${
        collapsed
          ? "flex-col items-center gap-2 px-1"
          : "items-center gap-1 px-2"
      }`}
    >
      <AdminBrandMark locale={locale} compact={collapsed} />
      <button
        type="button"
        onClick={toggleCollapsed}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-200 text-marco-slate/70 transition-colors hover:border-gray-300 hover:bg-marco-gray hover:text-marco-ink"
        aria-expanded={!collapsed}
        aria-label={collapseLabel}
        title={collapseLabel}
      >
        {collapsed ? (
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        ) : (
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
