"use client";

import { useState } from "react";

import type { AdminCategoryOption } from "@/features/products/application/list-admin-products";
import type { AdminProductsQueryState } from "@/features/products/domain/admin-products-query";
import { AdminProductsCategoryTree } from "@/features/products/ui/AdminProductsCategoryTree";
import {
  ADMIN_PRODUCTS_FIELD,
  ADMIN_PRODUCTS_FIELD_LABEL,
  ADMIN_PRODUCTS_PANEL,
} from "@/features/products/ui/admin-products.classes";
import { getAdminCopy } from "@/features/admin/ui/get-admin-copy";

type AdminProductsFilterPanelProps = {
  locale: string;
  panelId: string;
  filters: AdminProductsQueryState;
  categories: ReadonlyArray<AdminCategoryOption>;
  onChange: (next: Partial<AdminProductsQueryState>) => void;
};

export function AdminProductsFilterPanel({
  locale,
  panelId,
  filters,
  categories,
  onChange,
}: AdminProductsFilterPanelProps) {
  const copy = getAdminCopy(locale).products;
  const [categorySearch, setCategorySearch] = useState("");

  return (
    <div id={panelId} className={ADMIN_PRODUCTS_PANEL}>
      <div className="grid gap-4 p-4 sm:grid-cols-[7fr_3fr] sm:p-5">
        <div className="min-w-0">
          <span className={ADMIN_PRODUCTS_FIELD_LABEL}>{copy.filterCategory}</span>
          <div className="overflow-hidden rounded-xl border border-gray-200/80 bg-gray-50/50 shadow-sm focus-within:border-gray-400 focus-within:ring-2 focus-within:ring-marco-slate/10">
            <div className="border-b border-gray-200/80 bg-white px-3 py-2">
              <input
                type="search"
                value={categorySearch}
                onChange={(event) => setCategorySearch(event.target.value)}
                placeholder={copy.categorySearchPlaceholder}
                aria-label={copy.categorySearchPlaceholder}
                className="w-full border-0 bg-transparent py-1.5 text-sm text-marco-ink placeholder:text-gray-400 focus:outline-none"
              />
            </div>
            <div className="max-h-[min(32rem,55vh)] overflow-y-auto p-2">
              <AdminProductsCategoryTree
                categories={categories}
                selectedId={filters.categoryId}
                search={categorySearch}
                emptyLabel={copy.noCategoriesAvailable}
                notFoundLabel={copy.noCategoriesFound}
                onSelect={(categoryId) =>
                  onChange({ categoryId, page: 1 })
                }
              />
            </div>
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          <label>
            <span className={ADMIN_PRODUCTS_FIELD_LABEL}>{copy.filterStock}</span>
            <select
              value={filters.stock}
              aria-label={copy.filterStockAria}
              onChange={(event) =>
                onChange({
                  stock: event.target.value as AdminProductsQueryState["stock"],
                  page: 1,
                })
              }
              className={ADMIN_PRODUCTS_FIELD}
            >
              <option value="all">{copy.stockAll}</option>
              <option value="in_stock">{copy.stockIn}</option>
              <option value="out_of_stock">{copy.stockOut}</option>
              <option value="low_stock">{copy.stockLow}</option>
            </select>
          </label>
          <label>
            <span className={ADMIN_PRODUCTS_FIELD_LABEL}>{copy.filterStatus}</span>
            <select
              value={filters.published}
              aria-label={copy.filterStatusAria}
              onChange={(event) =>
                onChange({
                  published: event.target
                    .value as AdminProductsQueryState["published"],
                  page: 1,
                })
              }
              className={ADMIN_PRODUCTS_FIELD}
            >
              <option value="all">{copy.allStatuses}</option>
              <option value="published">{copy.published}</option>
              <option value="unpublished">{copy.draft}</option>
            </select>
          </label>
        </div>
      </div>
    </div>
  );
}
