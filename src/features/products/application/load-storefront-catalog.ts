import "server-only";

import { getCatalogFacets } from "@/features/products/application/load-catalog-facets";
import {
  collectCategoryIdsForSlugs,
  type CatalogFacets,
} from "@/features/products/domain/catalog-filters";
import {
  amdRangeToDisplayMajor,
  displayMajorRangeToAmd,
  normalizeSelectedPriceRange,
  type DisplayMajorRange,
} from "@/features/products/domain/catalog-price-bounds";
import {
  parseCatalogSearchParams,
  type CatalogSearchParams,
} from "@/features/products/domain/catalog-search-params";
import {
  getActiveProductsPage,
  type CatalogListFilter,
  type CatalogProduct,
} from "@/features/products/queries";
import { getCheckoutRateSnapshot } from "@/lib/fx/service";
import type { Locale } from "@/lib/i18n/config";
import type { Currency } from "@/lib/money/currency";

export type StorefrontCatalogResult = {
  filters: CatalogSearchParams;
  facets: CatalogFacets;
  priceBounds: DisplayMajorRange | null;
  products: CatalogProduct[];
  total: number;
  pageSize: number;
  page: number;
  totalPages: number;
};

function toDisplayBounds(
  facets: CatalogFacets,
  currency: Currency,
  rate: string,
): DisplayMajorRange | null {
  if (facets.minPriceAmd == null || facets.maxPriceAmd == null) return null;
  return amdRangeToDisplayMajor(
    facets.minPriceAmd,
    facets.maxPriceAmd,
    currency,
    rate,
  );
}

function toProductFilter(
  filters: CatalogSearchParams,
  facets: CatalogFacets,
  priceBounds: DisplayMajorRange | null,
  currency: Currency,
  rate: string,
): CatalogListFilter | undefined {
  const categoryIds = collectCategoryIdsForSlugs(
    facets.categories,
    filters.categorySlugs,
  );
  const hasPrice =
    priceBounds != null &&
    (filters.minPrice != null || filters.maxPrice != null);
  const amdRange =
    hasPrice && priceBounds
      ? displayMajorRangeToAmd(
          filters.minPrice ?? priceBounds.minMajor,
          filters.maxPrice ?? priceBounds.maxMajor,
          currency,
          rate,
        )
      : null;

  if (categoryIds.length === 0 && amdRange == null) return undefined;
  return {
    categoryIds,
    minPriceAmd: amdRange?.minAmd,
    maxPriceAmd: amdRange?.maxAmd,
  };
}

/** Loads the filtered storefront catalog, facets, and normalized URL state. */
export async function loadStorefrontCatalog(
  locale: Locale,
  searchParams: Record<string, string | string[] | undefined>,
  currency: Currency,
): Promise<StorefrontCatalogResult> {
  const [facets, quote] = await Promise.all([
    getCatalogFacets(locale),
    getCheckoutRateSnapshot(currency),
  ]);
  const priceBounds = toDisplayBounds(facets, currency, quote.rate);
  const parsed = parseCatalogSearchParams(searchParams);
  const price = priceBounds
    ? normalizeSelectedPriceRange(parsed.minPrice, parsed.maxPrice, priceBounds)
    : { minPrice: null, maxPrice: null };
  const filters: CatalogSearchParams = { ...parsed, ...price };
  const listFilter = toProductFilter(
    filters,
    facets,
    priceBounds,
    currency,
    quote.rate,
  );

  let page = filters.page;
  let catalog = await getActiveProductsPage(locale, page, listFilter);
  const totalPages = Math.max(1, Math.ceil(catalog.total / catalog.pageSize));
  if (page > totalPages) {
    page = totalPages;
    catalog = await getActiveProductsPage(locale, page, listFilter);
  }

  return {
    filters: { ...filters, page },
    facets,
    priceBounds,
    products: catalog.products,
    total: catalog.total,
    pageSize: catalog.pageSize,
    page,
    totalPages,
  };
}
