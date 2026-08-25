import {
  DEFAULT_CATALOG_PRICE_PRESENCE,
  DEFAULT_CATALOG_SORT,
  parseCatalogPricePresence,
  parseCatalogSort,
  type CatalogPricePresence,
  type CatalogSort,
} from "@/features/products/domain/catalog-sort";

export const CATALOG_SLUG_MAX_LENGTH = 120;
export const CATALOG_MAX_SELECTED_VALUES = 20;
export const CATALOG_MAX_PRICE_MAJOR = 99_999_999;

export type CatalogSearchParams = {
  page: number;
  categorySlugs: string[];
  brandSlugs: string[];
  colorHexes: string[];
  attributeValueIds: string[];
  minPrice: number | null;
  maxPrice: number | null;
  sort: CatalogSort;
  pricePresence: CatalogPricePresence;
};

export const EMPTY_CATALOG_SEARCH: CatalogSearchParams = {
  page: 1,
  categorySlugs: [],
  brandSlugs: [],
  colorHexes: [],
  attributeValueIds: [],
  minPrice: null,
  maxPrice: null,
  sort: DEFAULT_CATALOG_SORT,
  pricePresence: DEFAULT_CATALOG_PRICE_PRESENCE,
};

type RawSearchValue = string | string[] | undefined;

function readList(value: RawSearchValue): string[] {
  if (value == null) return [];
  const parts = Array.isArray(value) ? value : [value];
  const items: string[] = [];
  for (const part of parts) {
    for (const piece of part.split(",")) {
      const trimmed = piece.trim();
      if (trimmed) items.push(trimmed);
    }
  }
  return items;
}

function uniqueLimited(values: string[], max: number): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const value of values) {
    if (seen.has(value)) continue;
    seen.add(value);
    result.push(value);
    if (result.length >= max) break;
  }
  return result;
}

function parseSlugs(value: RawSearchValue): string[] {
  const slugs = readList(value).filter(
    (slug) => slug.length <= CATALOG_SLUG_MAX_LENGTH,
  );
  return uniqueLimited(slugs, CATALOG_MAX_SELECTED_VALUES);
}

function parseColorHexes(value: RawSearchValue): string[] {
  const hexes: string[] = [];
  for (const raw of readList(value)) {
    const hex = raw.replace(/^#/, "").toLowerCase();
    if (/^[0-9a-f]{6}$/.test(hex)) hexes.push(hex);
  }
  return uniqueLimited(hexes, CATALOG_MAX_SELECTED_VALUES);
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function parseAttributeValueIds(value: RawSearchValue): string[] {
  const ids = readList(value).filter((id) => UUID_RE.test(id));
  return uniqueLimited(ids, CATALOG_MAX_SELECTED_VALUES);
}

function parseOptionalInt(value: RawSearchValue): number | null {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw == null || raw.trim() === "") return null;
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed < 0) return null;
  return Math.min(Math.floor(parsed), CATALOG_MAX_PRICE_MAJOR);
}

function parsePage(value: RawSearchValue): number {
  const parsed = parseOptionalInt(value);
  return parsed != null && parsed > 0 ? parsed : 1;
}

/** Normalizes catalog URL search params; invalid values become safe defaults. */
export function parseCatalogSearchParams(
  searchParams: Record<string, RawSearchValue>,
): CatalogSearchParams {
  let minPrice = parseOptionalInt(searchParams.minPrice);
  let maxPrice = parseOptionalInt(searchParams.maxPrice);
  if (minPrice != null && maxPrice != null && minPrice > maxPrice) {
    const swap = minPrice;
    minPrice = maxPrice;
    maxPrice = swap;
  }

  return {
    page: parsePage(searchParams.page),
    categorySlugs: parseSlugs(searchParams.category),
    brandSlugs: parseSlugs(searchParams.brand),
    colorHexes: parseColorHexes(searchParams.color),
    attributeValueIds: parseAttributeValueIds(searchParams.attr),
    minPrice,
    maxPrice,
    sort: parseCatalogSort(searchParams.sort),
    pricePresence: parseCatalogPricePresence(searchParams.pricePresence),
  };
}
