const MAX_ATTRIBUTE_KEY_LENGTH = 80;

function normalizeAttributeKey(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, "")
    .slice(0, MAX_ATTRIBUTE_KEY_LENGTH);
}

/** Builds a lowercase, space-free key from an attribute name. */
export function generateAttributeKey(title: string): string {
  return normalizeAttributeKey(title) || "attribute";
}
