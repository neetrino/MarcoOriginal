"use client";

import { useMemo, useState } from "react";

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

    return flattenCategoryOptions(categories)
      .filter((row) => !excluded.has(row.item.id))
      .map((row) => ({
        label: optionLabel(row.item.title, row.depth),
        value: row.item.id,
        searchText: `${row.item.title} ${row.item.slug}`,
      }));
  }, [categories, excludeId]);

  return (
    <div className="space-y-2">
      <span className={ADMIN_LABEL}>
        {copy.parentLabel}
        {required ? <span className="text-red-600"> *</span> : null}
      </span>
      <SelectDropdown
        ariaLabel={copy.parentLabel}
        value={value}
        allLabel={copy.parentSelect}
        options={options}
        disabled={disabled}
        deferChange={false}
        searchValue={query}
        searchPlaceholder={copy.parentSearchPlaceholder}
        onSearchChange={setQuery}
        onValueChange={onChange}
      />
    </div>
  );
}
