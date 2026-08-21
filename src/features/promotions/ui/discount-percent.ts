/** Parses a board percent field: empty, 1–100 integer, or invalid. */
export function parseDiscountPercent(
  raw: string,
): number | null | "invalid" {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const next = Number(trimmed);
  if (!Number.isInteger(next) || next < 1 || next > 100) return "invalid";
  return next;
}

export function draftsFromPercents(
  items: ReadonlyArray<{ id: string; discountPercent: number | null }>,
): Record<string, string> {
  return Object.fromEntries(
    items.map((item) => [
      item.id,
      item.discountPercent != null ? String(item.discountPercent) : "",
    ]),
  );
}
