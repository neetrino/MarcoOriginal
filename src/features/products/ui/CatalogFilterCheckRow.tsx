"use client";

import {
  CATALOG_CHECKBOX_BOX,
  CATALOG_FILTER_COUNT,
  CATALOG_FILTER_ROW,
  catalogFilterCheckIconClass,
  catalogFilterCheckboxToneClass,
  type CatalogFilterCheckboxVariant,
} from "@/features/products/ui/catalog-filter-classes";

type CatalogFilterCheckRowProps = {
  label: string;
  selected: boolean;
  count?: number;
  labelClassName: string;
  variant?: CatalogFilterCheckboxVariant;
  onToggle: () => void;
};

function CatalogFilterCheckIcon({
  variant,
}: {
  variant: CatalogFilterCheckboxVariant;
}) {
  return (
    <svg
      width="12"
      height="10"
      viewBox="0 0 12 10"
      fill="none"
      className={catalogFilterCheckIconClass(variant)}
      aria-hidden
    >
      <path
        d="M1 5l3.5 3.5L11 1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CatalogFilterCheckRow({
  label,
  selected,
  count,
  labelClassName,
  variant = "checkmark",
  onToggle,
}: CatalogFilterCheckRowProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onToggle}
      className={`${CATALOG_FILTER_ROW} hover:opacity-90`}
    >
      <span
        className={`${CATALOG_CHECKBOX_BOX} ${catalogFilterCheckboxToneClass(selected, variant)}`}
        aria-hidden
      >
        {selected ? <CatalogFilterCheckIcon variant={variant} /> : null}
      </span>
      <span className={`min-w-0 flex-1 truncate ${labelClassName}`}>{label}</span>
      {count != null ? (
        <span className={CATALOG_FILTER_COUNT}>({count})</span>
      ) : null}
    </button>
  );
}
