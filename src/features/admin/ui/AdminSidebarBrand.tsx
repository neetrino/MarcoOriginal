"use client";

import { AdminBrandMark } from "@/features/admin/ui/AdminBrandMark";

type AdminSidebarBrandProps = {
  locale: string;
};

export function AdminSidebarBrand({ locale }: AdminSidebarBrandProps) {
  return (
    <div className="flex shrink-0 items-center gap-1 border-b border-gray-200 px-2 pb-3 pt-3">
      <AdminBrandMark locale={locale} />
    </div>
  );
}
