export const CATALOG_SORTS = [
  "default",
  "price-asc",
  "price-desc",
  "name-asc",
  "name-desc",
] as const;

export type CatalogSort = (typeof CATALOG_SORTS)[number];

export const CATALOG_PRICE_PRESENCE = ["with", "without"] as const;

export type CatalogPricePresence = (typeof CATALOG_PRICE_PRESENCE)[number];

export const DEFAULT_CATALOG_SORT: CatalogSort = "default";
export const DEFAULT_CATALOG_PRICE_PRESENCE: CatalogPricePresence = "with";

function isCatalogSort(value: string): value is CatalogSort {
  return (CATALOG_SORTS as readonly string[]).includes(value);
}

function isCatalogPricePresence(value: string): value is CatalogPricePresence {
  return (CATALOG_PRICE_PRESENCE as readonly string[]).includes(value);
}

function firstRawValue(value: string | string[] | undefined): string | null {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw == null || raw.trim() === "") return null;
  return raw.trim();
}

/** Normalizes `sort` query values; unknown input becomes default. */
export function parseCatalogSort(
  value: string | string[] | undefined,
): CatalogSort {
  const raw = firstRawValue(value);
  return raw && isCatalogSort(raw) ? raw : DEFAULT_CATALOG_SORT;
}

/** Normalizes `pricePresence` query values; unknown input becomes with-price. */
export function parseCatalogPricePresence(
  value: string | string[] | undefined,
): CatalogPricePresence {
  const raw = firstRawValue(value);
  return raw && isCatalogPricePresence(raw) ? raw : DEFAULT_CATALOG_PRICE_PRESENCE;
}
