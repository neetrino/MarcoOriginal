export const CATALOG_VIEW_MODES = ["list", "grid-2", "grid-3"] as const;

export type CatalogViewMode = (typeof CATALOG_VIEW_MODES)[number];

export const CATALOG_DEFAULT_VIEW_MODE: CatalogViewMode = "grid-2";

export const CATALOG_VIEW_MODE_STORAGE_KEY = "products-view-mode";

const CATALOG_GRID_GAP =
  "gap-x-3 gap-y-10 sm:gap-x-4 sm:gap-y-12 md:gap-x-6 md:gap-y-12";

export function isCatalogViewMode(value: string): value is CatalogViewMode {
  return (CATALOG_VIEW_MODES as readonly string[]).includes(value);
}

/** Reads a stored PLP view mode and falls back to the default shop grid. */
export function parseCatalogViewMode(value: string | null): CatalogViewMode {
  return value && isCatalogViewMode(value) ? value : CATALOG_DEFAULT_VIEW_MODE;
}

export function catalogGridClassName(mode: CatalogViewMode): string {
  if (mode === "list") return "grid grid-cols-1 gap-y-6";
  if (mode === "grid-3") {
    return `grid grid-cols-2 ${CATALOG_GRID_GAP} md:grid-cols-3 lg:grid-cols-4`;
  }
  return `grid grid-cols-2 ${CATALOG_GRID_GAP} md:grid-cols-3`;
}

export function catalogGridItemClassName(mode: CatalogViewMode): string {
  if (mode === "list") return "min-w-0 w-full";
  return "flex min-w-0 justify-center pb-7 sm:justify-end sm:pr-3 sm:pb-0 md:pr-4";
}
