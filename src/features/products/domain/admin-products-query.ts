import type { AdminProductsFilter } from "@/features/products/schemas/admin-list";

export type AdminProductsQueryState = Pick<
  AdminProductsFilter,
  "q" | "sku" | "categoryId" | "stock" | "published" | "sort" | "dir" | "page"
>;

export type AdminProductsSortField = "title" | "stock" | "price" | "created";

const DEFAULTS: Pick<
  AdminProductsQueryState,
  "stock" | "published" | "sort" | "dir" | "page"
> = {
  stock: "all",
  published: "all",
  sort: "created",
  dir: "desc",
  page: 1,
};

/** Builds the admin products list query string, omitting default values. */
export function buildAdminProductsQuery(
  filters: AdminProductsQueryState,
  overrides: Partial<AdminProductsQueryState> = {},
): string {
  const merged = { ...filters, ...overrides };
  const params = new URLSearchParams();
  if (merged.q) params.set("q", merged.q);
  if (merged.sku) params.set("sku", merged.sku);
  if (merged.categoryId) params.set("categoryId", merged.categoryId);
  if (merged.stock !== DEFAULTS.stock) params.set("stock", merged.stock);
  if (merged.published !== DEFAULTS.published) {
    params.set("published", merged.published);
  }
  if (merged.sort !== DEFAULTS.sort) params.set("sort", merged.sort);
  if (merged.dir !== DEFAULTS.dir) params.set("dir", merged.dir);
  if (merged.page > DEFAULTS.page) params.set("page", String(merged.page));
  return params.toString();
}

/** Locale-prefixed list href with the given query overrides. */
export function adminProductsHref(
  locale: string,
  filters: AdminProductsQueryState,
  overrides: Partial<AdminProductsQueryState> = {},
): string {
  const query = buildAdminProductsQuery(filters, overrides);
  return query
    ? `/${locale}/admin/products?${query}`
    : `/${locale}/admin/products`;
}

/** Toggles sort direction when the same column is clicked again. */
export function nextAdminProductsSort(
  filters: AdminProductsQueryState,
  sort: AdminProductsSortField,
): Pick<AdminProductsQueryState, "sort" | "dir" | "page"> {
  const nextDir =
    filters.sort === sort && filters.dir === "asc" ? "desc" : "asc";
  return {
    sort,
    dir: filters.sort === sort ? nextDir : "asc",
    page: 1,
  };
}

export function adminProductsSortHref(
  locale: string,
  filters: AdminProductsQueryState,
  sort: AdminProductsSortField,
): string {
  return adminProductsHref(locale, filters, nextAdminProductsSort(filters, sort));
}
