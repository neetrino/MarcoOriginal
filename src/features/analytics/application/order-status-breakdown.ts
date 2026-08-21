import "server-only";

import { and, count, eq, gte, lte } from "drizzle-orm";

import { getDb } from "@/db/client";
import { orders } from "@/db/schema";
import {
  ANALYTICS_STATUS_BUCKETS,
  analyticsStatusBucket,
  emptyAnalyticsStatusCounts,
  type AnalyticsStatusCounts,
} from "@/features/analytics/domain/analytics-display";
import { rangeForAnalyticsPeriod } from "@/features/analytics/domain/date-range";
import { isOrderStatus } from "@/features/orders/domain/order-status";

export type AnalyticsStatusWindowPeriod = "today" | "week" | "month";

export type AnalyticsStatusWindow = {
  period: AnalyticsStatusWindowPeriod;
  from: string;
  to: string;
  byStatus: AnalyticsStatusCounts;
  totalOrders: number;
};

export type AnalyticsOrderStatusBreakdown = {
  windows: AnalyticsStatusWindow[];
};

const WINDOW_PRESETS = [
  { period: "today", preset: "today" },
  { period: "week", preset: "last_7_days" },
  { period: "month", preset: "last_30_days" },
] as const;

function boundsFor(from: string, to: string): { start: Date; end: Date } {
  return {
    start: new Date(`${from}T00:00:00.000Z`),
    end: new Date(`${to}T23:59:59.999Z`),
  };
}

async function queryWindowCounts(
  from: string,
  to: string,
): Promise<{ byStatus: AnalyticsStatusCounts; totalOrders: number }> {
  const { start, end } = boundsFor(from, to);
  const rows = await getDb()
    .select({
      status: orders.status,
      value: count(),
    })
    .from(orders)
    .where(
      and(
        eq(orders.isArchived, false),
        gte(orders.placedAt, start),
        lte(orders.placedAt, end),
      ),
    )
    .groupBy(orders.status);

  const byStatus = emptyAnalyticsStatusCounts();
  for (const row of rows) {
    if (!isOrderStatus(row.status)) continue;
    byStatus[analyticsStatusBucket(row.status)] += row.value;
  }

  const totalOrders = ANALYTICS_STATUS_BUCKETS.reduce(
    (sum, key) => sum + byStatus[key],
    0,
  );
  return { byStatus, totalOrders };
}

/** Order counts by status for today, last 7 days, and last 30 days. */
export async function getOrderStatusBreakdown(): Promise<AnalyticsOrderStatusBreakdown> {
  const windows = await Promise.all(
    WINDOW_PRESETS.map(async ({ period, preset }) => {
      const range = rangeForAnalyticsPeriod(preset);
      const counts = await queryWindowCounts(range.from, range.to);
      return { period, from: range.from, to: range.to, ...counts };
    }),
  );

  return { windows };
}
