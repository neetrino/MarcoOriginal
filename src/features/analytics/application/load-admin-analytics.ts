import "server-only";

import { getCustomerAnalytics } from "@/features/analytics/application/customer-analytics";
import { getOrderStatusBreakdown } from "@/features/analytics/application/order-status-breakdown";
import { getAnalyticsSummary } from "@/features/analytics/application/queries";
import { getStockAnalytics } from "@/features/analytics/application/stock-analytics";
import type { OrderStatus } from "@/features/orders/domain/order-status";
import { getStoreRevenue } from "@/features/settings/application/queries";
import type { Locale } from "@/lib/i18n/config";

/** Loads the admin analytics page payload in parallel. */
export async function loadAdminAnalytics(input: {
  from: string;
  to: string;
  locale: Locale;
}) {
  const start = new Date(`${input.from}T00:00:00.000Z`);
  const end = new Date(`${input.to}T23:59:59.999Z`);
  const revenue = await getStoreRevenue();
  const revenueStatuses = revenue.statuses as OrderStatus[];

  const [summary, orderStatus, customers, stock] = await Promise.all([
    getAnalyticsSummary(input),
    getOrderStatusBreakdown(),
    getCustomerAnalytics({ start, end, revenueStatuses }),
    getStockAnalytics(input.locale),
  ]);

  return { summary, orderStatus, customers, stock };
}
