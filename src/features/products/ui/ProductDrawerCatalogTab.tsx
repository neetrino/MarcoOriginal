"use client";

import { useMemo, useState } from "react";

import type {
  AdminBrandOption,
  AdminCategoryOption,
} from "@/features/products/application/list-admin-products";
import {
  filterBrandOptions,
  filterCategoryOptions,
  toggleSelectedId,
} from "@/features/products/domain/product-drawer-catalog-filter";
import { ProductDrawerBrandList } from "@/features/products/ui/ProductDrawerBrandList";
import { ProductDrawerCatalogPanel } from "@/features/products/ui/ProductDrawerCatalogPanel";
import { ProductDrawerCategoryTree } from "@/features/products/ui/ProductDrawerCategoryTree";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

type EditorCopy = Dictionary["admin"]["productEditor"];

type ProductDrawerCatalogTabProps = {
  copy: EditorCopy;
  categories: readonly AdminCategoryOption[];
  categoryIds: readonly string[];
  brands: readonly AdminBrandOption[];
  brandIds: readonly string[];
  disabled: boolean;
  onCategoryIdsChange: (ids: string[]) => void;
  onBrandIdsChange: (ids: string[]) => void;
};

export function ProductDrawerCatalogTab({
  copy,
  categories,
  categoryIds,
  brands,
  brandIds,
  disabled,
  onCategoryIdsChange,
  onBrandIdsChange,
}: ProductDrawerCatalogTabProps) {
  const [categoryQuery, setCategoryQuery] = useState("");
  const [brandQuery, setBrandQuery] = useState("");
  const visibleCategories = useMemo(
    () => filterCategoryOptions(categories, categoryQuery),
    [categories, categoryQuery],
  );
  const visibleBrands = useMemo(
    () => filterBrandOptions(brands, brandQuery),
    [brands, brandQuery],
  );

  return (
    <div className="grid min-h-[28rem] gap-4 lg:grid-cols-2">
      <ProductDrawerCatalogPanel
        title={copy.catalogCategoriesTitle}
        hint={copy.catalogCategoriesHint}
        searchLabel={copy.catalogCategoriesSearch}
        searchPlaceholder={copy.catalogCategoriesSearch}
        searchValue={categoryQuery}
        emptyLabel={
          categories.length === 0
            ? copy.catalogCategoriesEmpty
            : copy.catalogCategoriesNoMatch
        }
        isEmpty={visibleCategories.length === 0}
        disabled={disabled}
        onSearchChange={setCategoryQuery}
      >
        <ProductDrawerCategoryTree
          categories={visibleCategories}
          selectedIds={categoryIds}
          expandLabel={copy.catalogExpandCategory}
          collapseLabel={copy.catalogCollapseCategory}
          disabled={disabled}
          onToggle={(id) =>
            onCategoryIdsChange(toggleSelectedId(categoryIds, id))
          }
        />
      </ProductDrawerCatalogPanel>

      <ProductDrawerCatalogPanel
        title={copy.catalogBrandsTitle}
        hint={copy.catalogBrandsHint}
        searchLabel={copy.catalogBrandsSearch}
        searchPlaceholder={copy.catalogBrandsSearch}
        searchValue={brandQuery}
        emptyLabel={
          brands.length === 0
            ? copy.catalogBrandsEmpty
            : copy.catalogBrandsNoMatch
        }
        isEmpty={visibleBrands.length === 0}
        disabled={disabled}
        onSearchChange={setBrandQuery}
      >
        <ProductDrawerBrandList
          brands={visibleBrands}
          selectedIds={brandIds}
          disabled={disabled}
          onToggle={(id) => onBrandIdsChange(toggleSelectedId(brandIds, id))}
        />
      </ProductDrawerCatalogPanel>
    </div>
  );
}
