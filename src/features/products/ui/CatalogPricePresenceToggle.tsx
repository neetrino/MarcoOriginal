"use client";

import { Banknote } from "lucide-react";

import { withCatalogPricePresence } from "@/features/products/domain/catalog-href";
import type { CatalogSearchParams } from "@/features/products/domain/catalog-search-params";
import {
  CATALOG_PRICE_PRESENCE_GROUP,
  catalogPricePresenceSegmentClass,
} from "@/features/products/ui/catalog-filter-classes";

type CatalogPricePresenceToggleProps = {
  filters: CatalogSearchParams;
  withPrice: string;
  withoutPrice: string;
  pricePresenceAria: string;
  compact?: boolean;
  onFiltersChange: (next: CatalogSearchParams) => void;
};

export function CatalogPricePresenceToggle({
  filters,
  withPrice,
  withoutPrice,
  pricePresenceAria,
  compact = false,
  onFiltersChange,
}: CatalogPricePresenceToggleProps) {
  return (
    <div
      className={`${CATALOG_PRICE_PRESENCE_GROUP} ${compact ? "" : "w-full"}`}
      role="group"
      aria-label={pricePresenceAria}
    >
      <button
        type="button"
        className={catalogPricePresenceSegmentClass(
          filters.pricePresence === "with",
          compact,
        )}
        aria-pressed={filters.pricePresence === "with"}
        onClick={() => onFiltersChange(withCatalogPricePresence(filters, "with"))}
      >
        <Banknote className={compact ? "h-4 w-4 shrink-0" : "h-3.5 w-3.5 shrink-0"} strokeWidth={2} />
        {withPrice}
      </button>
      <button
        type="button"
        className={catalogPricePresenceSegmentClass(
          filters.pricePresence === "without",
          compact,
        )}
        aria-pressed={filters.pricePresence === "without"}
        onClick={() =>
          onFiltersChange(withCatalogPricePresence(filters, "without"))
        }
      >
        {withoutPrice}
      </button>
    </div>
  );
}
