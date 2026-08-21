"use client";

import {
  CatalogViewDenseGridIcon,
  CatalogViewGridIcon,
  CatalogViewListIcon,
} from "@/features/products/ui/catalog-listing-toolbar-icons";
import {
  CATALOG_VIEW_TOGGLE_GROUP,
  catalogViewToggleSegmentClass,
} from "@/features/products/ui/catalog-filter-classes";
import { useCatalogViewMode } from "@/features/products/ui/CatalogViewModeProvider";
import type { CatalogViewMode } from "@/features/products/ui/catalog-view-mode";

type CatalogViewModeToggleCopy = {
  viewList: string;
  viewGrid: string;
  viewDense: string;
};

const VIEW_OPTIONS: ReadonlyArray<{
  mode: CatalogViewMode;
  labelKey: keyof CatalogViewModeToggleCopy;
  icon: typeof CatalogViewListIcon;
}> = [
  { mode: "list", labelKey: "viewList", icon: CatalogViewListIcon },
  { mode: "grid-2", labelKey: "viewGrid", icon: CatalogViewGridIcon },
  { mode: "grid-3", labelKey: "viewDense", icon: CatalogViewDenseGridIcon },
];

export function CatalogViewModeToggle({ copy }: { copy: CatalogViewModeToggleCopy }) {
  const { mode, setMode } = useCatalogViewMode();

  return (
    <div className={CATALOG_VIEW_TOGGLE_GROUP} role="group">
      {VIEW_OPTIONS.map((option) => {
        const Icon = option.icon;
        return (
          <button
            key={option.mode}
            type="button"
            className={catalogViewToggleSegmentClass(mode === option.mode)}
            aria-label={copy[option.labelKey]}
            aria-pressed={mode === option.mode}
            onClick={() => setMode(option.mode)}
          >
            <Icon />
          </button>
        );
      })}
    </div>
  );
}
