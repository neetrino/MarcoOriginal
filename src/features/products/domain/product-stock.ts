export const DEFAULT_PRODUCT_STOCK = 1000;
export const PRODUCT_RESTOCK_AT = 100;

/**
 * After a sale, refill to the default quantity when remaining stock
 * hits the restock threshold.
 */
export function restockIfAtThreshold(stockAfterSale: number): number {
  if (stockAfterSale <= PRODUCT_RESTOCK_AT) {
    return DEFAULT_PRODUCT_STOCK;
  }
  return stockAfterSale;
}
