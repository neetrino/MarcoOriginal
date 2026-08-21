import { ANALYTICS_RANK_LIMIT } from "@/features/analytics/domain/analytics-display";

export type RankedProductSale = {
  productId: string;
  quantitySold: number;
};

/**
 * Top N by units sold, then the lowest N among the remaining sold products.
 */
export function pickBestAndLeastSelling<T extends RankedProductSale>(
  rows: readonly T[],
  limit: number = ANALYTICS_RANK_LIMIT,
): { bestSelling: T[]; leastSelling: T[] } {
  const sortedDesc = [...rows].sort((left, right) => {
    if (right.quantitySold !== left.quantitySold) {
      return right.quantitySold - left.quantitySold;
    }
    return left.productId.localeCompare(right.productId);
  });
  const bestSelling = sortedDesc.slice(0, limit);
  const bestIds = new Set(bestSelling.map((row) => row.productId));
  const leastSelling = rows
    .filter((row) => !bestIds.has(row.productId))
    .sort((left, right) => {
      if (left.quantitySold !== right.quantitySold) {
        return left.quantitySold - right.quantitySold;
      }
      return left.productId.localeCompare(right.productId);
    })
    .slice(0, limit);

  return { bestSelling, leastSelling };
}
