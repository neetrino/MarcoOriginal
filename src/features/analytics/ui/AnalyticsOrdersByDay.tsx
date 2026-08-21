import { Card } from "@/components/ui/Card";
import {
  formatAdminMessage,
  getAdminCopy,
} from "@/features/admin/ui/get-admin-copy";
import type { AnalyticsCsvRow } from "@/features/analytics/domain/csv";
import { formatAnalyticsShortDate } from "@/features/analytics/domain/date-range";
import {
  ANALYTICS_ACCENT_CLASS,
  ANALYTICS_PANEL_CLASS,
  ANALYTICS_ROW_CLASS,
  ANALYTICS_SECTION_ICON,
} from "@/features/analytics/ui/analytics-card-classes";
import { AnalyticsOrdersTrendChart } from "@/features/analytics/ui/AnalyticsOrdersTrendChart";

type AnalyticsOrdersByDayProps = {
  locale: string;
  rows: AnalyticsCsvRow[];
  formatMoney: (amount: number) => string;
};

export function AnalyticsOrdersByDay({
  locale,
  rows,
  formatMoney,
}: AnalyticsOrdersByDayProps) {
  const copy = getAdminCopy(locale).analytics;
  const maxOrders = Math.max(...rows.map((row) => row.orderCount), 1);

  return (
    <Card className={ANALYTICS_PANEL_CLASS}>
      <div className={ANALYTICS_ACCENT_CLASS} />
      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-marco-ink">{copy.ordersByDay}</h2>
          <p className="mt-0.5 text-sm text-marco-slate/70">{copy.ordersByDayHint}</p>
        </div>
        <div className={ANALYTICS_SECTION_ICON}>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="py-12 text-center text-sm text-marco-slate/65">{copy.noOrders}</p>
      ) : (
        <>
          <div className="mb-6 rounded-2xl border border-gray-200/80 bg-white/80 p-4">
            <AnalyticsOrdersTrendChart
              rows={rows}
              chartAria={copy.chartAria}
              locale={locale}
            />
          </div>
          <div className="space-y-3">
            {rows.map((row) => {
              const widthPct = Math.max(8, Math.round((row.orderCount / maxOrders) * 100));
              return (
                <div key={row.date} className={ANALYTICS_ROW_CLASS}>
                  <p className="w-28 shrink-0 text-sm font-semibold text-marco-slate/80">
                    {formatAnalyticsShortDate(row.date, locale)}
                  </p>
                  <div className="relative h-8 flex-1 overflow-hidden rounded-full bg-marco-gray shadow-inner">
                    <div
                      className="flex h-8 items-center rounded-full bg-marco-yellow px-3"
                      style={{ width: `${widthPct}%` }}
                    >
                      <span className="text-xs font-bold text-marco-ink">
                        {formatAdminMessage(copy.ordersCount, { count: row.orderCount })}
                      </span>
                    </div>
                  </div>
                  <div className="w-32 shrink-0 text-right">
                    <p className="text-sm font-semibold text-marco-ink">
                      {formatMoney(row.revenueAmount)}
                    </p>
                    <p className="mt-0.5 text-xs text-marco-slate/65">{copy.revenue}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </Card>
  );
}
