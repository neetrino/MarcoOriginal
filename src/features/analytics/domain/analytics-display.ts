import type { OrderStatus } from "@/features/orders/domain/order-status";

export const ANALYTICS_RANK_LIMIT = 5;
export const ANALYTICS_SALES_POOL_LIMIT = 200;
export const ANALYTICS_STOCK_LIST_LIMIT = 10;
export const ANALYTICS_LOW_STOCK_THRESHOLD = 5;
export const ANALYTICS_TOP_CUSTOMERS_LIMIT = 8;

export type AnalyticsStatusBucket =
  | "pending"
  | "processing"
  | "completed"
  | "cancelled"
  | "other";

export const ANALYTICS_STATUS_BUCKETS: readonly AnalyticsStatusBucket[] = [
  "pending",
  "processing",
  "completed",
  "cancelled",
  "other",
];

export type AnalyticsStatusCounts = Record<AnalyticsStatusBucket, number>;

/** Maps fulfillment status onto the supersudo breakdown columns. */
export function analyticsStatusBucket(
  status: OrderStatus,
): AnalyticsStatusBucket {
  if (status === "PENDING" || status === "CONFIRMED") return "pending";
  if (status === "PROCESSING" || status === "SHIPPED") return "processing";
  if (status === "DELIVERED") return "completed";
  if (status === "CANCELLED" || status === "REFUNDED") return "cancelled";
  return "other";
}

/** Empty status counts used before aggregating query rows. */
export function emptyAnalyticsStatusCounts(): AnalyticsStatusCounts {
  return {
    pending: 0,
    processing: 0,
    completed: 0,
    cancelled: 0,
    other: 0,
  };
}

/** Inclusive low-stock max shown in the stock hint (threshold − 1). */
export function analyticsLowStockMax(threshold: number): number {
  return Math.max(0, threshold - 1);
}

/** Medal colors for ranked product/category rows. */
export function analyticsRankClass(rank: number): string {
  if (rank === 1) return "bg-yellow-400 text-yellow-900";
  if (rank === 2) return "bg-gray-300 text-gray-700";
  if (rank === 3) return "bg-orange-300 text-orange-900";
  return "bg-gray-200 text-gray-600";
}
