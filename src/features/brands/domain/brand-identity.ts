function normalizeBrandKey(title: string): string {
  return title
    .trim()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

/** Builds a URL-safe slug from a brand title. */
export function slugifyBrandTitle(title: string): string {
  return normalizeBrandKey(title).toLowerCase() || "brand";
}

/** Builds an uppercase SKU from a brand title. */
export function generateBrandSku(title: string): string {
  return normalizeBrandKey(title).toUpperCase() || "BRAND";
}
