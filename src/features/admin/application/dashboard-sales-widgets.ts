import "server-only";

import { and, count, eq, gte, inArray, lte, sql } from "drizzle-orm";

import { getDb } from "@/db/client";
import { orders } from "@/db/schema";
import {
  localDayBounds,
  localMonthBounds,
} from "@/features/admin/domain/dashboard-display";
import { queryTopSellingProducts } from "@/features/analytics/application/top-rankings";
import type { OrderStatus } from "@/features/orders/domain/order-status";
import { getStoreRevenue } from "@/features/settings/application/queries";

export type DashboardSalesWindow = {
  revenue: number;
  paidOrders: number;
  currency: string;
};

export type DashboardSalesWidgets = {
  todaySales: DashboardSalesWindow;
  monthlySales: DashboardSalesWindow;
  topProduct: {
    productId: string;
    title: string;
    totalQuantity: number;
    totalRevenue: number;
    currency: string;
  } | null;
};

async function getSalesWindow(
  start: Date,
  end: Date,
  statuses: OrderStatus[],
): Promise<DashboardSalesWindow> {
  const [row] = await getDb()
    .select({
      revenue: sql<number>`coalesce(sum(${orders.totalAmount}), 0)`.mapWith(
        Number,
      ),
      paidOrders: count(),
      currency: sql<string>`coalesce(max(${orders.baseCurrency}), 'AMD')`,
    })
    .from(orders)
    .where(
      and(
        eq(orders.isArchived, false),
        gte(orders.placedAt, start),
        lte(orders.placedAt, end),
        inArray(orders.status, statuses),
      ),
    );

  return {
    revenue: row?.revenue ?? 0,
    paidOrders: row?.paidOrders ?? 0,
    currency: row?.currency ?? "AMD",
  };
}

/** Today / this-month sales plus the current month's top product. */
export async function getDashboardSalesWidgets(
  now: Date = new Date(),
): Promise<DashboardSalesWidgets> {
  const revenue = await getStoreRevenue();
  const statuses = revenue.statuses as OrderStatus[];
  const today = localDayBounds(now);
  const month = localMonthBounds(now);

  const [todaySales, monthlySales, monthTop] = await Promise.all([
    getSalesWindow(today.start, today.end, statuses),
    getSalesWindow(month.start, month.end, statuses),
    queryTopSellingProducts({
      start: month.start,
      end: month.end,
      revenueStatuses: statuses,
      limit: 1,
    }),
  ]);

  const top = monthTop[0] ?? null;

  return {
    todaySales,
    monthlySales,
    topProduct: top
      ? {
          productId: top.productId,
          title: top.title,
          totalQuantity: top.quantitySold,
          totalRevenue: top.revenueAmount,
          currency: monthlySales.currency,
        }
      : null,
  };
}
