"use client";

import { useMemo, useState } from "react";

import { AdminSearchInput } from "@/features/admin/ui/AdminSearchInput";
import { ADMIN_LABEL } from "@/features/admin/ui/admin-form-classes";
import { SelectDropdown } from "@/components/ui/SelectDropdown";
import type { AdminCategoryListItem } from "@/features/categories/application/list-admin-categories";
import {
  collectDescendantIds,
  flattenCategoryOptions,
} from "@/features/categories/domain/category-tree";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

type CategoriesCopy = Dictionary["admin"]["categories"];

type CategoryParentFieldProps = {
  copy: CategoriesCopy;
  categories: AdminCategoryListItem[];
  excludeId?: string;
  value: string;
  disabled: boolean;
  required: boolean;
  onChange: (value: string) => void;
};

function optionLabel(title: string, depth: number): string {
  return `${"— ".repeat(depth)}${title}`;
}

export function CategoryParentField({
  copy,
  categories,
  excludeId,
  value,
  disabled,
  required,
  onChange,
}: CategoryParentFieldProps) {
  const [query, setQuery] = useState("");

  const options = useMemo(() => {
    const excluded = excludeId
      ? new Set([excludeId, ...collectDescendantIds(excludeId, categories)])
      : new Set<string>();
    const needle = query.trim().toLowerCase();

    return flattenCategoryOptions(categories)
      .filter((row) => {
        if (excluded.has(row.item.id)) return false;
        if (!needle) return true;
        return (
          row.item.title.toLowerCase().includes(needle) ||
          row.item.slug.toLowerCase().includes(needle)
        );
      })
      .map((row) => ({
        label: optionLabel(row.item.title, row.depth),
        value: row.item.id,
      }));
  }, [categories, excludeId, query]);

  return (
    <div className="space-y-2">
      <span className={ADMIN_LABEL}>
        {copy.parentLabel}
        {required ? <span className="text-red-600"> *</span> : null}
      </span>
      <AdminSearchInput
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={copy.parentSearchPlaceholder}
        disabled={disabled}
        aria-label={copy.parentSearchPlaceholder}
      />
      <SelectDropdown
        ariaLabel={copy.parentLabel}
        value={value}
        allLabel={copy.parentSelect}
        options={options}
        disabled={disabled}
        deferChange={false}
        onValueChange={onChange}
      />
    </div>
  );
}
