import type { AdminCategoryOption } from "@/features/products/application/list-admin-products";
import type { AdminProductsQueryState } from "@/features/products/domain/admin-products-query";

export type AdminProductsFilterChip = {
  key: string;
  label: string;
  clear: Partial<AdminProductsQueryState>;
};

type ChipCopy = {
  stockIn: string;
  stockOut: string;
  stockLow: string;
  published: string;
  draft: string;
};

export function buildAdminProductsFilterChips(
  filters: AdminProductsQueryState,
  categories: ReadonlyArray<AdminCategoryOption>,
  copy: ChipCopy,
): AdminProductsFilterChip[] {
  const chips: AdminProductsFilterChip[] = [];
  const category = categories.find((item) => item.id === filters.categoryId);
  if (category) {
    chips.push({
      key: `category-${category.id}`,
      label: category.title,
      clear: { categoryId: undefined, page: 1 },
    });
  }
  if (filters.stock === "in_stock") {
    chips.push({ key: "stock", label: copy.stockIn, clear: { stock: "all", page: 1 } });
  } else if (filters.stock === "out_of_stock") {
    chips.push({ key: "stock", label: copy.stockOut, clear: { stock: "all", page: 1 } });
  } else if (filters.stock === "low_stock") {
    chips.push({ key: "stock", label: copy.stockLow, clear: { stock: "all", page: 1 } });
  }
  if (filters.published === "published") {
    chips.push({
      key: "status",
      label: copy.published,
      clear: { published: "all", page: 1 },
    });
  } else if (filters.published === "unpublished") {
    chips.push({
      key: "status",
      label: copy.draft,
      clear: { published: "all", page: 1 },
    });
  }
  return chips;
}

export function adminProductsHasActiveFilters(
  filters: AdminProductsQueryState,
  searchValue: string,
): boolean {
  return (
    searchValue.trim().length > 0 ||
    Boolean(filters.q) ||
    Boolean(filters.sku) ||
    Boolean(filters.categoryId) ||
    filters.stock !== "all" ||
    filters.published !== "all"
  );
}

export function clearedAdminProductsFilters(): Partial<AdminProductsQueryState> {
  return {
    q: undefined,
    sku: undefined,
    categoryId: undefined,
    stock: "all",
    published: "all",
    page: 1,
  };
}
