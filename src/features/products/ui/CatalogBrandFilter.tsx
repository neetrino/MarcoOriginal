"use client";

import type { CatalogBrandFacet } from "@/features/products/domain/catalog-filters";
import { CatalogFilterCheckRow } from "@/features/products/ui/CatalogFilterCheckRow";

type CatalogBrandFilterProps = {
  brands: readonly CatalogBrandFacet[];
  selectedSlugs: ReadonlySet<string>;
  onToggle: (slug: string) => void;
};

export function CatalogBrandFilter({
  brands,
  selectedSlugs,
  onToggle,
}: CatalogBrandFilterProps) {
  if (brands.length === 0) return null;

  return (
    <ul className="flex flex-col">
      {brands.map((brand) => (
        <li key={brand.id}>
          <CatalogFilterCheckRow
            label={brand.title}
            selected={selectedSlugs.has(brand.slug)}
            onToggle={() => onToggle(brand.slug)}
          />
        </li>
      ))}
    </ul>
  );
}
