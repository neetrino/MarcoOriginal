"use client";

import type { CatalogColorFacet } from "@/features/products/domain/catalog-filters";

type CatalogColorFilterProps = {
  colors: readonly CatalogColorFacet[];
  selectedIds: ReadonlySet<string>;
  label: string;
  onToggle: (valueId: string) => void;
};

function isLightHex(hex: string): boolean {
  const raw = hex.replace("#", "").trim();
  const full =
    raw.length === 3 ? raw.split("").map((char) => char + char).join("") : raw;
  if (full.length !== 6) return false;
  const value = Number.parseInt(full, 16);
  if (Number.isNaN(value)) return false;
  const red = (value >> 16) & 255;
  const green = (value >> 8) & 255;
  const blue = value & 255;
  return (0.299 * red + 0.587 * green + 0.114 * blue) / 255 > 0.62;
}

function CatalogColorSwatchCheck({ light }: { light: boolean }) {
  return (
    <span
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
      aria-hidden
    >
      <svg
        width="14"
        height="12"
        viewBox="0 0 12 10"
        fill="none"
        className={
          light
            ? "text-marco-ink"
            : "text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]"
        }
      >
        <path
          d="M1 5l3.5 3.5L11 1"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export function CatalogColorFilter({
  colors,
  selectedIds,
  label,
  onToggle,
}: CatalogColorFilterProps) {
  if (colors.length === 0) return null;

  return (
    <ul className="flex flex-wrap justify-center gap-x-[22px] gap-y-3" aria-label={label}>
      {colors.map((color) => {
        const selected = selectedIds.has(color.id);
        return (
          <li key={color.id}>
            <button
              type="button"
              aria-pressed={selected}
              aria-label={`#${color.hex}`}
              onClick={() => onToggle(color.id)}
              className={`relative size-8 overflow-hidden rounded-full ${
                selected
                  ? "ring-2 ring-marco-ink ring-offset-2"
                  : "ring-1 ring-[#e2e8f0] hover:ring-[#cad5e2]"
              }`}
              style={{ backgroundColor: `#${color.hex}` }}
            >
              {selected ? (
                <CatalogColorSwatchCheck light={isLightHex(color.hex)} />
              ) : null}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
