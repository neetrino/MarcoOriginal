/** Splits items into fixed-size pages. Empty input yields no pages. */
export function chunkItems<T>(items: readonly T[], pageSize: number): T[][] {
  if (pageSize <= 0 || items.length === 0) {
    return [];
  }

  const pages: T[][] = [];
  for (let i = 0; i < items.length; i += pageSize) {
    pages.push([...items.slice(i, i + pageSize)]);
  }
  return pages;
}

/** Clamps a requested page into a 1-based window and slices the items. */
export function paginateItems<T>(
  items: readonly T[],
  page: number,
  pageSize: number,
): {
  pageItems: readonly T[];
  page: number;
  totalPages: number;
} {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const requested = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const safePage = Math.min(requested, totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    pageItems: items.slice(start, start + pageSize),
    page: safePage,
    totalPages,
  };
}
