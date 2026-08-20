"use client";

import type { CatalogFacets } from "@/features/products/domain/catalog-filters";
import {
  withPriceRange,
  withToggledBrand,
  withToggledCategory,
  withToggledColor,
} from "@/features/products/domain/catalog-href";
import { normalizeSelectedPriceRange } from "@/features/products/domain/catalog-price-bounds";
import type { CatalogSearchParams } from "@/features/products/domain/catalog-search-params";
import { CatalogBrandFilter } from "@/features/products/ui/CatalogBrandFilter";
import { CatalogCategoryFilter } from "@/features/products/ui/CatalogCategoryFilter";
import { CatalogColorFilter } from "@/features/products/ui/CatalogColorFilter";
import { CatalogPriceFilter } from "@/features/products/ui/CatalogPriceFilter";
import {
  CATALOG_FILTER_SECTION,
  CATALOG_FILTER_TITLE,
} from "@/features/products/ui/catalog-filter-classes";
import type { Currency } from "@/lib/money/currency";

export type CatalogFilterCopy = {
  categories: string;
  price: string;
  brands: string;
  colors: string;
  expandCategory: string;
  collapseCategory: string;
  minPrice: string;
  maxPrice: string;
};

type CatalogFilterPanelProps = {
  filters: CatalogSearchParams;
  facets: CatalogFacets;
  priceBounds: { minMajor: number; maxMajor: number } | null;
  currency: Currency;
  copy: CatalogFilterCopy;
  onFiltersChange: (next: CatalogSearchParams) => void;
};

export function CatalogFilterPanel({
  filters,
  facets,
  priceBounds,
  currency,
  copy,
  onFiltersChange,
}: CatalogFilterPanelProps) {
  const selectedCategories = new Set(filters.categorySlugs);
  const selectedBrands = new Set(filters.brandSlugs);
  const selectedColors = new Set(filters.colorHexes);
  const selectedMin = filters.minPrice ?? priceBounds?.minMajor ?? 0;
  const selectedMax = filters.maxPrice ?? priceBounds?.maxMajor ?? 0;

  return (
    <div className="flex flex-col gap-5">
      <section className={CATALOG_FILTER_SECTION}>
        <h2 className={CATALOG_FILTER_TITLE}>{copy.categories}</h2>
        <CatalogCategoryFilter
          nodes={facets.categories}
          selectedSlugs={selectedCategories}
          expandLabel={copy.expandCategory}
          collapseLabel={copy.collapseCategory}
          onToggle={(slug) =>
            onFiltersChange(withToggledCategory(filters, slug))
          }
        />
      </section>
      {priceBounds ? (
        <section className={CATALOG_FILTER_SECTION}>
          <h2 className={CATALOG_FILTER_TITLE}>{copy.price}</h2>
          <CatalogPriceFilter
            key={`${priceBounds.minMajor}-${priceBounds.maxMajor}-${selectedMin}-${selectedMax}`}
            minBound={priceBounds.minMajor}
            maxBound={priceBounds.maxMajor}
            selectedMin={selectedMin}
            selectedMax={selectedMax}
            currency={currency}
            minLabel={copy.minPrice}
            maxLabel={copy.maxPrice}
            onChange={(min, max) => {
              const next = normalizeSelectedPriceRange(min, max, priceBounds);
              onFiltersChange(withPriceRange(filters, next.minPrice, next.maxPrice));
            }}
          />
        </section>
      ) : null}
      <section className={CATALOG_FILTER_SECTION}>
        <h2 className={CATALOG_FILTER_TITLE}>{copy.brands}</h2>
        <CatalogBrandFilter
          brands={facets.brands}
          selectedSlugs={selectedBrands}
          onToggle={(slug) => onFiltersChange(withToggledBrand(filters, slug))}
        />
      </section>
      <section>
        <h2 className={CATALOG_FILTER_TITLE}>{copy.colors}</h2>
        <CatalogColorFilter
          colors={facets.colors}
          selectedHexes={selectedColors}
          label={copy.colors}
          onToggle={(hex) => onFiltersChange(withToggledColor(filters, hex))}
        />
      </section>
    </div>
  );
}
