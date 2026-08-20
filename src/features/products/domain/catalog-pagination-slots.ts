/** Builds compact page-number slots with ellipses (marco.am PLP pattern). */
export function catalogPaginationSlots(
  totalPages: number,
  current: number,
): Array<number | "ellipsis"> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const unique = new Set<number>([
    1,
    totalPages,
    current - 1,
    current,
    current + 1,
  ]);
  const sorted = [...unique]
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);

  const slots: Array<number | "ellipsis"> = [];
  for (let index = 0; index < sorted.length; index += 1) {
    const page = sorted[index];
    if (page == null) continue;
    const previous = sorted[index - 1];
    if (previous != null && page - previous > 1) {
      slots.push("ellipsis");
    }
    slots.push(page);
  }
  return slots;
}
