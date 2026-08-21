export type AdminPaginationItem = number | "ellipsis";

/** Compact page list: all pages when few, edges + window otherwise. */
export function buildAdminPaginationItems(
  current: number,
  total: number,
): readonly AdminPaginationItem[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }
  if (current <= 4) {
    return [1, 2, 3, 4, 5, "ellipsis", total];
  }
  if (current >= total - 3) {
    return [1, "ellipsis", total - 4, total - 3, total - 2, total - 1, total];
  }
  return [1, "ellipsis", current - 1, current, current + 1, "ellipsis", total];
}
