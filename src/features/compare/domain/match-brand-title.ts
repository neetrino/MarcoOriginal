const MIN_BRAND_MATCH_LENGTH = 2;

/** Picks the longest brand title that appears in the product title. */
export function matchBrandTitle(
  productTitle: string,
  brandTitles: readonly string[],
): string | null {
  const haystack = productTitle.toLocaleLowerCase();
  let best: string | null = null;

  for (const title of brandTitles) {
    const needle = title.trim();
    if (needle.length < MIN_BRAND_MATCH_LENGTH) {
      continue;
    }
    if (!haystack.includes(needle.toLocaleLowerCase())) {
      continue;
    }
    if (best == null || needle.length > best.length) {
      best = needle;
    }
  }

  return best;
}
