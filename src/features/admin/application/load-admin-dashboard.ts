import "server-only";

import { getDashboardSalesWidgets } from "@/features/admin/application/dashboard-sales-widgets";
import { getDashboardUserActivity } from "@/features/admin/application/dashboard-user-activity";
import { queryTopSellingProducts } from "@/features/analytics/application/top-rankings";
import { defaultAnalyticsDateRange } from "@/features/analytics/domain/date-range";
import { getAdminDashboardMetrics } from "@/features/orders/application/queries";
import type { OrderStatus } from "@/features/orders/domain/order-status";
import { getStoreRevenue } from "@/features/settings/application/queries";

/** Loads the admin home dashboard payload in parallel. */
export async function loadAdminDashboard() {
  const range = defaultAnalyticsDateRange();
  const start = new Date(`${range.from}T00:00:00.000Z`);
  const end = new Date(`${range.to}T23:59:59.999Z`);
  const revenue = await getStoreRevenue();

  const [metrics, salesWidgets, userActivity, topProducts] = await Promise.all([
    getAdminDashboardMetrics(range),
    getDashboardSalesWidgets(),
    getDashboardUserActivity(),
    queryTopSellingProducts({
      start,
      end,
      revenueStatuses: revenue.statuses as OrderStatus[],
      limit: 5,
    }),
  ]);

  return { metrics, salesWidgets, userActivity, topProducts };
}
