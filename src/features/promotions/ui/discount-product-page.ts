export const PRODUCT_DISCOUNT_PAGE_SIZE = 12;

export function paginateDiscountItems<T>(
  items: readonly T[],
  page: number,
  pageSize = PRODUCT_DISCOUNT_PAGE_SIZE,
): { page: number; totalPages: number; items: T[] } {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  return {
    page: safePage,
    totalPages,
    items: items.slice(start, start + pageSize),
  };
}
