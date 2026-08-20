export const MAX_PRODUCT_SPECS = 20;
export const MAX_SPEC_TITLE_LENGTH = 80;
export const MAX_SPEC_VALUE_LENGTH = 200;

export type ProductSpecification = {
  id: string;
  title: string;
  value: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Parses persisted specification rows, dropping empty or invalid entries. */
export function parseProductSpecs(value: unknown): ProductSpecification[] {
  if (!Array.isArray(value)) return [];
  const rows: ProductSpecification[] = [];
  for (const entry of value) {
    if (rows.length >= MAX_PRODUCT_SPECS) break;
    if (!isRecord(entry)) continue;
    const title =
      typeof entry.title === "string"
        ? entry.title.trim().slice(0, MAX_SPEC_TITLE_LENGTH)
        : "";
    const specValue =
      typeof entry.value === "string"
        ? entry.value.trim().slice(0, MAX_SPEC_VALUE_LENGTH)
        : "";
    if (!title && !specValue) continue;
    const id =
      typeof entry.id === "string" && entry.id.length > 0
        ? entry.id
        : crypto.randomUUID();
    rows.push({ id, title, value: specValue });
  }
  return rows;
}

export function createDraftProductSpec(): ProductSpecification {
  return {
    id: crypto.randomUUID(),
    title: "",
    value: "",
  };
}

/** Builds a URL-safe product slug from a title. */
export function slugifyProductTitle(title: string): string {
  const slug = title
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);

  return slug || "product";
}
