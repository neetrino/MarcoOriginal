"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState, type ReactNode } from "react";

import { SideSheet } from "@/components/ui/SideSheet";
import { catalogHref } from "@/features/products/domain/catalog-href";
import type { CatalogFacets } from "@/features/products/domain/catalog-filters";
import type { CatalogSearchParams } from "@/features/products/domain/catalog-search-params";
import {
  CatalogFilterPanel,
  type CatalogFilterCopy,
} from "@/features/products/ui/CatalogFilterPanel";
import {
  CatalogListingToolbar,
  type CatalogListingToolbarCopy,
} from "@/features/products/ui/CatalogListingToolbar";
import { CatalogPageTitle } from "@/features/products/ui/CatalogPageTitle";
import { CatalogViewModeProvider } from "@/features/products/ui/CatalogViewModeProvider";
import {
  CATALOG_FILTER_ASIDE,
  CATALOG_FILTER_ASIDE_SCROLL,
  CATALOG_LAYOUT,
} from "@/features/products/ui/catalog-filter-classes";
import type { Currency } from "@/lib/money/currency";

type CatalogFilterSidebarProps = {
  locale: string;
  pageTitle: string;
  filters: CatalogSearchParams;
  facets: CatalogFacets;
  priceBounds: { minMajor: number; maxMajor: number } | null;
  currency: Currency;
  copy: CatalogFilterCopy & CatalogListingToolbarCopy;
  children: ReactNode;
};

/** Storefront catalog layout: left filters (drawer on mobile) + product grid. */
export function CatalogFilterSidebar({
  locale,
  pageTitle,
  filters,
  facets,
  priceBounds,
  currency,
  copy,
  children,
}: CatalogFilterSidebarProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const onFiltersChange = useCallback(
    (next: CatalogSearchParams) => {
      router.push(catalogHref(locale, next));
    },
    [locale, router],
  );

  const panel = (
    <CatalogFilterPanel
      filters={filters}
      facets={facets}
      priceBounds={priceBounds}
      currency={currency}
      copy={copy}
      onFiltersChange={onFiltersChange}
    />
  );

  return (
    <CatalogViewModeProvider>
      <div className={CATALOG_LAYOUT}>
        <aside className={CATALOG_FILTER_ASIDE}>
          <div className="mb-4 shrink-0 lg:mb-5 xl:mb-6">
            <CatalogPageTitle title={pageTitle} />
          </div>
          <div className={CATALOG_FILTER_ASIDE_SCROLL}>{panel}</div>
        </aside>
        <div className="min-w-0 flex-1">
          <div className="pb-3 min-[744px]:hidden">
            <CatalogPageTitle title={pageTitle} />
          </div>
          <CatalogListingToolbar
            filters={filters}
            copy={copy}
            onFiltersChange={onFiltersChange}
            onOpenFilters={() => setOpen(true)}
          />
          <SideSheet
            open={open}
            onClose={() => setOpen(false)}
            ariaLabel={copy.filtersLabel}
            side="left"
            panelClassName="w-full max-w-sm"
          >
            <div className="h-full overflow-y-auto px-5 py-6">{panel}</div>
          </SideSheet>
          {children}
        </div>
      </div>
    </CatalogViewModeProvider>
  );
}
