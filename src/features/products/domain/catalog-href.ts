import type { CatalogSearchParams } from "@/features/products/domain/catalog-search-params";

function appendList(
  params: URLSearchParams,
  key: string,
  values: readonly string[],
): void {
  for (const value of values) {
    params.append(key, value);
  }
}

/** Builds a locale catalog path from normalized search params. */
export function catalogHref(
  locale: string,
  filters: CatalogSearchParams,
): string {
  const params = new URLSearchParams();
  appendList(params, "category", filters.categorySlugs);
  appendList(params, "brand", filters.brandSlugs);
  appendList(params, "color", filters.colorHexes);
  if (filters.minPrice != null) {
    params.set("minPrice", String(filters.minPrice));
  }
  if (filters.maxPrice != null) {
    params.set("maxPrice", String(filters.maxPrice));
  }
  if (filters.page > 1) {
    params.set("page", String(filters.page));
  }

  const query = params.toString();
  return query ? `/${locale}/products?${query}` : `/${locale}/products`;
}

function toggleValue(values: readonly string[], value: string): string[] {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

/** Toggles a category slug and resets pagination. */
export function withToggledCategory(
  filters: CatalogSearchParams,
  slug: string,
): CatalogSearchParams {
  return {
    ...filters,
    page: 1,
    categorySlugs: toggleValue(filters.categorySlugs, slug),
  };
}

/** Toggles a brand slug and resets pagination. */
export function withToggledBrand(
  filters: CatalogSearchParams,
  slug: string,
): CatalogSearchParams {
  return {
    ...filters,
    page: 1,
    brandSlugs: toggleValue(filters.brandSlugs, slug),
  };
}

/** Toggles a 6-digit color hex and resets pagination. */
export function withToggledColor(
  filters: CatalogSearchParams,
  hex: string,
): CatalogSearchParams {
  return {
    ...filters,
    page: 1,
    colorHexes: toggleValue(filters.colorHexes, hex),
  };
}

/** Sets display-currency major price bounds and resets pagination. */
export function withPriceRange(
  filters: CatalogSearchParams,
  minPrice: number | null,
  maxPrice: number | null,
): CatalogSearchParams {
  return {
    ...filters,
    page: 1,
    minPrice,
    maxPrice,
  };
}

/** Sets the catalog page while keeping other filters. */
export function withCatalogPage(
  filters: CatalogSearchParams,
  page: number,
): CatalogSearchParams {
  return { ...filters, page };
}
