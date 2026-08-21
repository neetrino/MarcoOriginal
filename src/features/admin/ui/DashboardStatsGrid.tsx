import Link from "next/link";

import {
  DASHBOARD_STAT_ACCENT_CLASS,
  DASHBOARD_STAT_CARD_CLASS,
  DASHBOARD_STAT_ICON_CLASS,
} from "@/features/admin/ui/dashboard-card-classes";
import { getAdminCopy } from "@/features/admin/ui/get-admin-copy";

type DashboardStatsGridProps = {
  locale: string;
  users: number;
  products: number;
  orders: number;
  revenueLabel: string;
};

const STAT_ICONS = {
  users:
    "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
  products:
    "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
  orders:
    "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
  revenue:
    "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
} as const;

function StatCard({
  href,
  label,
  value,
  iconPath,
}: {
  href: string;
  label: string;
  value: string;
  iconPath: string;
}) {
  return (
    <Link href={href} className={DASHBOARD_STAT_CARD_CLASS}>
      <div className={DASHBOARD_STAT_ACCENT_CLASS} />
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-marco-slate/70">{label}</p>
          <p className="mt-1 text-2xl font-bold text-marco-ink">{value}</p>
        </div>
        <div className={DASHBOARD_STAT_ICON_CLASS}>
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={iconPath}
            />
          </svg>
        </div>
      </div>
    </Link>
  );
}

export function DashboardStatsGrid({
  locale,
  users,
  products,
  orders,
  revenueLabel,
}: DashboardStatsGridProps) {
  const base = `/${locale}/admin`;
  const copy = getAdminCopy(locale).dashboard;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        href={`${base}/users`}
        label={copy.totalUsers}
        value={String(users)}
        iconPath={STAT_ICONS.users}
      />
      <StatCard
        href={`${base}/products`}
        label={copy.totalProducts}
        value={String(products)}
        iconPath={STAT_ICONS.products}
      />
      <StatCard
        href={`${base}/orders`}
        label={copy.totalOrders}
        value={String(orders)}
        iconPath={STAT_ICONS.orders}
      />
      <StatCard
        href={`${base}/orders`}
        label={copy.revenue}
        value={revenueLabel}
        iconPath={STAT_ICONS.revenue}
      />
    </div>
  );
}
