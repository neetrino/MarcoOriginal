"use client";

import type { CatalogAttributeFacet } from "@/features/products/domain/catalog-filters";
import { CatalogColorFilter } from "@/features/products/ui/CatalogColorFilter";
import { CatalogFilterCheckRow } from "@/features/products/ui/CatalogFilterCheckRow";
import { catalogFilterBrandLabelClass } from "@/features/products/ui/catalog-filter-classes";

type CatalogAttributeFilterProps = {
  attribute: CatalogAttributeFacet;
  selectedIds: ReadonlySet<string>;
  onToggle: (valueId: string) => void;
};

export function CatalogAttributeFilter({
  attribute,
  selectedIds,
  onToggle,
}: CatalogAttributeFilterProps) {
  const colorValues = attribute.values.filter((value) => value.colorHex);
  const textValues = attribute.values.filter((value) => !value.colorHex);

  return (
    <div className="flex flex-col gap-3">
      {colorValues.length > 0 ? (
        <CatalogColorFilter
          colors={colorValues.map((value) => ({
            id: value.id,
            hex: value.colorHex as string,
          }))}
          selectedIds={selectedIds}
          label={attribute.title}
          onToggle={onToggle}
        />
      ) : null}
      {textValues.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {textValues.map((value) => {
            const selected = selectedIds.has(value.id);
            return (
              <li key={value.id}>
                <CatalogFilterCheckRow
                  selected={selected}
                  label={value.title}
                  labelClassName={catalogFilterBrandLabelClass(selected)}
                  onToggle={() => onToggle(value.id)}
                />
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
