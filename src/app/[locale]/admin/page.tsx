import { notFound } from "next/navigation";

import { loadAdminDashboard } from "@/features/admin/application/load-admin-dashboard";
import { formatDashboardMoney } from "@/features/admin/domain/dashboard-display";
import { DashboardRecentOrders } from "@/features/admin/ui/DashboardRecentOrders";
import { DashboardSalesWidgets } from "@/features/admin/ui/DashboardSalesWidgets";
import { DashboardStatsGrid } from "@/features/admin/ui/DashboardStatsGrid";
import { DashboardTopProducts } from "@/features/admin/ui/DashboardTopProducts";
import { DashboardUserActivity } from "@/features/admin/ui/DashboardUserActivity";
import {
  ADMIN_PAGE_SUBTITLE,
  ADMIN_PAGE_TITLE,
} from "@/features/admin/ui/admin-form-classes";
import { formatAdminMessage } from "@/features/admin/ui/get-admin-copy";
import { requireAdmin } from "@/lib/auth/policies";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

type AdminPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminPage({ params }: AdminPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  const [admin, dashboard] = await Promise.all([
    requireAdmin(locale),
    loadAdminDashboard(),
  ]);
  const copy = getDictionary(locale).admin.dashboard;
  const { metrics, salesWidgets, userActivity, topProducts } = dashboard;

  const money = (amount: number, currency: string) =>
    formatDashboardMoney(amount, currency, locale);

  return (
    <section>
      <header className="mb-5 sm:mb-7">
        <h1 className={ADMIN_PAGE_TITLE}>{copy.title}</h1>
        <p className={`mt-1 ${ADMIN_PAGE_SUBTITLE}`}>
          {formatAdminMessage(copy.welcome, { name: admin.firstName })}
        </p>
      </header>

      <div className="space-y-6 pb-8">
        <DashboardStatsGrid
          locale={locale}
          users={metrics.users}
          products={metrics.products}
          orders={metrics.orders}
          revenueLabel={money(metrics.revenueAmount, "AMD")}
        />

        <DashboardSalesWidgets
          locale={locale}
          widgets={salesWidgets}
          todayLabel={money(
            salesWidgets.todaySales.revenue,
            salesWidgets.todaySales.currency,
          )}
          monthLabel={money(
            salesWidgets.monthlySales.revenue,
            salesWidgets.monthlySales.currency,
          )}
          topProductLabel={
            salesWidgets.topProduct
              ? money(
                  salesWidgets.topProduct.totalRevenue,
                  salesWidgets.topProduct.currency,
                )
              : ""
          }
        />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <DashboardRecentOrders
            locale={locale}
            orders={metrics.recentOrders}
            formatAmount={money}
          />
          <DashboardTopProducts
            locale={locale}
            products={topProducts}
            formatAmount={money}
            currency={salesWidgets.monthlySales.currency}
          />
        </div>

        <DashboardUserActivity
          locale={locale}
          activity={userActivity}
          formatAmount={(amount) =>
            money(amount, salesWidgets.monthlySales.currency)
          }
        />
      </div>
    </section>
  );
}
