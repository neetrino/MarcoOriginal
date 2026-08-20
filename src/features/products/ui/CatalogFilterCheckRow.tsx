"use client";

import { Check } from "lucide-react";

import {
  CATALOG_CHECKBOX_BOX,
  CATALOG_FILTER_COUNT,
  CATALOG_FILTER_ROW,
} from "@/features/products/ui/catalog-filter-classes";

type CatalogFilterCheckRowProps = {
  label: string;
  selected: boolean;
  count?: number;
  onToggle: () => void;
};

export function CatalogFilterCheckRow({
  label,
  selected,
  count,
  onToggle,
}: CatalogFilterCheckRowProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onToggle}
      className={CATALOG_FILTER_ROW}
    >
      <span
        className={`${CATALOG_CHECKBOX_BOX} ${
          selected
            ? "border-marco-yellow bg-marco-yellow"
            : "border-[#cad5e2] bg-white"
        }`}
        aria-hidden
      >
        {selected ? (
          <Check className="h-3 w-3 text-marco-slate" strokeWidth={3} />
        ) : null}
      </span>
      <span className="min-w-0 flex-1 truncate text-left">{label}</span>
      {count != null ? (
        <span className={CATALOG_FILTER_COUNT}>({count})</span>
      ) : null}
    </button>
  );
}
