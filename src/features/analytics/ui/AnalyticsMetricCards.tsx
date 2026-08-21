import Link from "next/link";

import { Card } from "@/components/ui/Card";
import {
  DASHBOARD_STAT_ACCENT_CLASS,
  DASHBOARD_STAT_CARD_CLASS,
  DASHBOARD_STAT_ICON_CLASS,
} from "@/features/admin/ui/dashboard-card-classes";
import { getAdminCopy } from "@/features/admin/ui/get-admin-copy";

type AnalyticsMetricCardsProps = {
  locale: string;
  orderCount: number;
  revenueLabel: string;
  averageOrderLabel: string;
  userCount: number;
};

const ICONS = {
  orders:
    "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
  revenue:
    "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  users:
    "M17 20h5v-1a4 4 0 00-4-4h-1M7 20H2v-1a4 4 0 014-4h1m4-9a3 3 0 110 6 3 3 0 010-6zm6 3a3 3 0 11-6 0 3 3 0 016 0z",
} as const;

function MetricCard({
  href,
  title,
  label,
  value,
  iconPath,
  linked,
}: {
  href?: string;
  title: string;
  label: string;
  value: string;
  iconPath: string;
  linked?: boolean;
}) {
  const content = (
    <>
      <div className={DASHBOARD_STAT_ACCENT_CLASS} />
      <div className="mb-3 flex items-center justify-between">
        <div className={DASHBOARD_STAT_ICON_CLASS}>
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPath} />
          </svg>
        </div>
        {linked ? (
          <svg
            className="h-4 w-4 text-gray-500 opacity-0 transition-opacity group-hover:opacity-100"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        ) : null}
      </div>
      <p className="mb-1 text-sm font-medium text-marco-slate/70">{label}</p>
      <p className="text-2xl font-bold text-marco-ink sm:text-3xl">{value}</p>
    </>
  );

  if (href) {
    return (
      <Link href={href} title={title} className={DASHBOARD_STAT_CARD_CLASS}>
        {content}
      </Link>
    );
  }

  return (
    <Card className={DASHBOARD_STAT_CARD_CLASS} title={title}>
      {content}
    </Card>
  );
}

export function AnalyticsMetricCards({
  locale,
  orderCount,
  revenueLabel,
  averageOrderLabel,
  userCount,
}: AnalyticsMetricCardsProps) {
  const copy = getAdminCopy(locale).analytics;
  const ordersHref = `/${locale}/admin/orders`;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        href={ordersHref}
        title={copy.clickToViewAllOrders}
        label={copy.totalOrders}
        value={String(orderCount)}
        iconPath={ICONS.orders}
        linked
      />
      <MetricCard
        href={`${ordersHref}?paymentStatus=CAPTURED`}
        title={copy.clickToViewPaidOrders}
        label={copy.totalRevenue}
        value={revenueLabel}
        iconPath={ICONS.revenue}
        linked
      />
      <MetricCard
        title={copy.averageOrderValue}
        label={copy.averageOrderValue}
        value={averageOrderLabel}
        iconPath={ICONS.revenue}
      />
      <MetricCard
        title={copy.totalRegisteredUsers}
        label={copy.totalUsers}
        value={String(userCount)}
        iconPath={ICONS.users}
      />
    </div>
  );
}
