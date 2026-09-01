/** Max length for storefront catalog `q` (aligned with admin list search). */
export const CATALOG_SEARCH_QUERY_MAX_LENGTH = 100;

/**
 * Trims and bounds a raw catalog search string.
 * Empty / whitespace-only input becomes null.
 */
export function normalizeCatalogSearchQuery(
  raw: string | null | undefined,
): string | null {
  if (raw == null) return null;
  const trimmed = raw.trim().slice(0, CATALOG_SEARCH_QUERY_MAX_LENGTH);
  return trimmed.length > 0 ? trimmed : null;
}

/** Escapes `\`, `%`, and `_` so user input is treated as a literal substring. */
export function escapeIlikeLiteral(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/%/g, "\\%")
    .replace(/_/g, "\\_");
}

/** Builds an ILIKE contains pattern; pair with `ESCAPE '\'` in SQL. */
export function toIlikeContainsPattern(query: string): string {
  return `%${escapeIlikeLiteral(query)}%`;
}
