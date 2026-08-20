"use client";

import type { CatalogColorFacet } from "@/features/products/domain/catalog-filters";

type CatalogColorFilterProps = {
  colors: readonly CatalogColorFacet[];
  selectedHexes: ReadonlySet<string>;
  label: string;
  onToggle: (hex: string) => void;
};

export function CatalogColorFilter({
  colors,
  selectedHexes,
  label,
  onToggle,
}: CatalogColorFilterProps) {
  if (colors.length === 0) return null;

  return (
    <ul className="grid grid-cols-6 gap-2" aria-label={label}>
      {colors.map((color) => {
        const selected = selectedHexes.has(color.hex);
        return (
          <li key={color.id}>
            <button
              type="button"
              aria-pressed={selected}
              aria-label={`#${color.hex}`}
              onClick={() => onToggle(color.hex)}
              className={`h-7 w-7 rounded-full border border-gray-200 ${
                selected ? "ring-2 ring-gray-900 ring-offset-1" : ""
              }`}
              style={{ backgroundColor: `#${color.hex}` }}
            />
          </li>
        );
      })}
    </ul>
  );
}
