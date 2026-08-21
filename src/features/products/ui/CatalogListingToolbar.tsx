"use client";

import { useEffect, useRef, useState } from "react";

import { withCatalogSort } from "@/features/products/domain/catalog-href";
import type { CatalogSearchParams } from "@/features/products/domain/catalog-search-params";
import type { CatalogSort } from "@/features/products/domain/catalog-sort";
import {
  CATALOG_MOBILE_FILTER_BUTTON,
  CATALOG_SORT_TRIGGER,
} from "@/features/products/ui/catalog-filter-classes";
import {
  CatalogFiltersIcon,
  CatalogSortChevron,
  CatalogSortSlidersIcon,
} from "@/features/products/ui/catalog-listing-toolbar-icons";
import { CatalogPricePresenceToggle } from "@/features/products/ui/CatalogPricePresenceToggle";
import { CatalogViewModeToggle } from "@/features/products/ui/CatalogViewModeToggle";

export type CatalogListingToolbarCopy = {
  filtersLabel: string;
  sortLabel: string;
  sortDefault: string;
  sortPriceAsc: string;
  sortPriceDesc: string;
  sortNameAsc: string;
  sortNameDesc: string;
  sortProducts: string;
  withPrice: string;
  withoutPrice: string;
  pricePresenceAria: string;
  viewList: string;
  viewGrid: string;
  viewDense: string;
};

type CatalogListingToolbarProps = {
  filters: CatalogSearchParams;
  copy: CatalogListingToolbarCopy;
  onFiltersChange: (next: CatalogSearchParams) => void;
  onOpenFilters: () => void;
};

const SORT_OPTIONS: ReadonlyArray<{
  value: CatalogSort;
  labelKey: keyof CatalogListingToolbarCopy;
}> = [
  { value: "price-asc", labelKey: "sortPriceAsc" },
  { value: "price-desc", labelKey: "sortPriceDesc" },
  { value: "name-asc", labelKey: "sortNameAsc" },
  { value: "name-desc", labelKey: "sortNameDesc" },
];

function sortItemClass(active: boolean): string {
  return [
    "flex h-10 min-h-10 w-full shrink-0 items-center px-4 text-left text-sm",
    active ? "bg-gray-100 font-semibold text-gray-900" : "text-gray-700 hover:bg-gray-50",
  ].join(" ");
}

/** Desktop: price left, view + sort right. Mobile: filters + sort, then price. */
export function CatalogListingToolbar({
  filters,
  copy,
  onFiltersChange,
  onOpenFilters,
}: CatalogListingToolbarProps) {
  const sortMenu = (
    <CatalogSortMenu filters={filters} copy={copy} onFiltersChange={onFiltersChange} />
  );
  const priceToggle = (compact: boolean) => (
    <CatalogPricePresenceToggle
      filters={filters}
      withPrice={copy.withPrice}
      withoutPrice={copy.withoutPrice}
      pricePresenceAria={copy.pricePresenceAria}
      compact={compact}
      onFiltersChange={onFiltersChange}
    />
  );

  return (
    <>
      <div className="relative z-30 hidden items-center justify-between gap-4 pb-4 min-[744px]:flex">
        {priceToggle(true)}
        <div className="flex items-center gap-4">
          <CatalogViewModeToggle copy={copy} />
          {sortMenu}
        </div>
      </div>
      <div className="relative z-30 flex flex-col gap-4 pb-4 min-[744px]:hidden">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            className={CATALOG_MOBILE_FILTER_BUTTON}
            onClick={onOpenFilters}
          >
            <CatalogFiltersIcon />
            {copy.filtersLabel}
          </button>
          {sortMenu}
        </div>
        {priceToggle(false)}
      </div>
    </>
  );
}

function CatalogSortMenu({
  filters,
  copy,
  onFiltersChange,
}: Omit<CatalogListingToolbarProps, "onOpenFilters">) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const sortLabel = SORT_OPTIONS.find((option) => option.value === filters.sort)?.labelKey;
  const sortButtonLabel = sortLabel ? copy[sortLabel] : copy.sortLabel;

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  return (
    <div className="relative min-w-0" ref={menuRef}>
      <button
        type="button"
        className={CATALOG_SORT_TRIGGER}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((current) => !current)}
      >
        <CatalogSortSlidersIcon />
        <span className="whitespace-nowrap">{sortButtonLabel}</span>
        <CatalogSortChevron open={open} />
      </button>
      {open ? (
        <div
          className="absolute top-full right-0 z-[100] mt-2 w-max min-w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg"
          role="listbox"
          aria-label={copy.sortProducts}
        >
          <button
            type="button"
            className={sortItemClass(filters.sort === "default")}
            onClick={() => {
              onFiltersChange(withCatalogSort(filters, "default"));
              setOpen(false);
            }}
          >
            {copy.sortDefault}
          </button>
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              className={sortItemClass(filters.sort === option.value)}
              onClick={() => {
                onFiltersChange(withCatalogSort(filters, option.value));
                setOpen(false);
              }}
            >
              {copy[option.labelKey]}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
