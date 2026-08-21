import { notFound } from "next/navigation";

import {
  ADMIN_PAGE_SUBTITLE,
  ADMIN_PAGE_TITLE,
} from "@/features/admin/ui/admin-form-classes";
import { getAdminCopy } from "@/features/admin/ui/get-admin-copy";
import { loadAdminAnalytics } from "@/features/analytics/application/load-admin-analytics";
import {
  analyticsDateRangeSchema,
  matchAnalyticsPeriodPreset,
  rangeForAnalyticsPeriod,
} from "@/features/analytics/domain/date-range";
import { AnalyticsCustomerSection } from "@/features/analytics/ui/AnalyticsCustomerSection";
import { AnalyticsLeastSelling } from "@/features/analytics/ui/AnalyticsLeastSelling";
import { AnalyticsMetricCards } from "@/features/analytics/ui/AnalyticsMetricCards";
import { AnalyticsOrderStatusBreakdown } from "@/features/analytics/ui/AnalyticsOrderStatusBreakdown";
import { AnalyticsOrdersByDay } from "@/features/analytics/ui/AnalyticsOrdersByDay";
import { AnalyticsPeriodCard } from "@/features/analytics/ui/AnalyticsPeriodCard";
import { AnalyticsStockSection } from "@/features/analytics/ui/AnalyticsStockSection";
import { AnalyticsTopCategories } from "@/features/analytics/ui/AnalyticsTopCategories";
import { AnalyticsTopProducts } from "@/features/analytics/ui/AnalyticsTopProducts";
import { isLocale } from "@/lib/i18n/config";
import { formatMoneyAmount } from "@/lib/money/format";

type AdminAnalyticsPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function firstParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export default async function AdminAnalyticsPage({
  params,
  searchParams,
}: AdminAnalyticsPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const raw = await searchParams;
  const defaults = rangeForAnalyticsPeriod("last_7_days");
  const parsed = analyticsDateRangeSchema.safeParse({
    from: firstParam(raw.from) ?? defaults.from,
    to: firstParam(raw.to) ?? defaults.to,
  });
  const range = parsed.success ? parsed.data : defaults;
  const preset = matchAnalyticsPeriodPreset(range);
  const { summary, orderStatus, customers, stock } = await loadAdminAnalytics({
    ...range,
    locale,
  });
  const exportQuery = new URLSearchParams({
    from: range.from,
    to: range.to,
  }).toString();
  const formatMoney = (amount: number): string =>
    formatMoneyAmount(amount, "AMD", locale);
  const copy = getAdminCopy(locale).analytics;

  return (
    <section>
      <header className="mb-5 sm:mb-7">
        <h1 className={ADMIN_PAGE_TITLE}>{copy.title}</h1>
        <p className={`mt-1 ${ADMIN_PAGE_SUBTITLE}`}>{copy.subtitle}</p>
      </header>

      <div className="space-y-6 pb-8">
        <AnalyticsPeriodCard
          key={`${range.from}:${range.to}`}
          locale={locale}
          from={range.from}
          to={range.to}
          preset={preset}
          exportQuery={exportQuery}
          rangeInvalid={!parsed.success}
        />
        <AnalyticsMetricCards
          locale={locale}
          orderCount={summary.orderCount}
          revenueLabel={formatMoney(summary.revenueAmount)}
          averageOrderLabel={formatMoney(summary.averageOrderValue)}
          userCount={summary.userCount}
        />
        <AnalyticsOrderStatusBreakdown locale={locale} data={orderStatus} />
        <AnalyticsCustomerSection
          locale={locale}
          data={customers}
          formatMoney={formatMoney}
        />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <AnalyticsTopProducts
            locale={locale}
            products={summary.topProducts}
            formatMoney={formatMoney}
          />
          <AnalyticsLeastSelling
            locale={locale}
            products={summary.leastSellingProducts}
            formatMoney={formatMoney}
          />
        </div>
        <AnalyticsTopCategories
          locale={locale}
          categories={summary.topCategories}
          formatMoney={formatMoney}
        />
        <AnalyticsOrdersByDay
          locale={locale}
          rows={summary.dailyRows}
          formatMoney={formatMoney}
        />
        <AnalyticsStockSection locale={locale} data={stock} />
      </div>
    </section>
  );
}
