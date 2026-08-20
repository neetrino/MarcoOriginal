"use client";

import { Plus } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { ADMIN_PAGE_TITLE } from "@/features/admin/ui/admin-form-classes";
import { AdminSearchInput } from "@/features/admin/ui/AdminSearchInput";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

type CategoriesCopy = Dictionary["admin"]["categories"];

type AdminCategoriesToolbarProps = {
  copy: CategoriesCopy;
  query: string;
  onQueryChange: (value: string) => void;
  onAddCategory: () => void;
  onAddSubcategory: () => void;
};

export function AdminCategoriesToolbar({
  copy,
  query,
  onQueryChange,
  onAddCategory,
  onAddSubcategory,
}: AdminCategoriesToolbarProps) {
  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className={ADMIN_PAGE_TITLE}>{copy.title}</h1>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onAddSubcategory}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <Plus className="h-4 w-4" aria-hidden />
            {copy.addSubcategory}
          </button>
          <button
            type="button"
            onClick={onAddCategory}
            className="inline-flex items-center gap-1.5 rounded-xl bg-marco-yellow px-3 py-2 text-sm font-semibold text-marco-slate transition-[filter] hover:brightness-95"
          >
            <Plus className="h-4 w-4" aria-hidden />
            {copy.addCategory}
          </button>
        </div>
      </div>

      <Card className="mb-4 p-4">
        <p className="mb-2 text-sm font-medium text-gray-700">
          {copy.searchLabel}
        </p>
        <AdminSearchInput
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={copy.searchPlaceholder}
          aria-label={copy.searchLabel}
        />
      </Card>
    </>
  );
}
