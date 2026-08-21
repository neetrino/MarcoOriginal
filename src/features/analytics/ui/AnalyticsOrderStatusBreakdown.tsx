import { Card } from "@/components/ui/Card";
import { getAdminCopy } from "@/features/admin/ui/get-admin-copy";
import type { AnalyticsOrderStatusBreakdown as Breakdown } from "@/features/analytics/application/order-status-breakdown";
import {
  ANALYTICS_STATUS_BUCKETS,
  type AnalyticsStatusBucket,
} from "@/features/analytics/domain/analytics-display";
import {
  ANALYTICS_ACCENT_SKY,
  ANALYTICS_PANEL_CLASS,
  ANALYTICS_TABLE_WRAP,
} from "@/features/analytics/ui/analytics-card-classes";

type AnalyticsOrderStatusBreakdownProps = {
  locale: string;
  data: Breakdown;
};

function windowFor(data: Breakdown, period: "today" | "week" | "month") {
  return data.windows.find((window) => window.period === period);
}

export function AnalyticsOrderStatusBreakdown({
  locale,
  data,
}: AnalyticsOrderStatusBreakdownProps) {
  const copy = getAdminCopy(locale).analytics;
  const today = windowFor(data, "today");
  const week = windowFor(data, "week");
  const month = windowFor(data, "month");
  if (!today || !week || !month) return null;

  const labels: Record<AnalyticsStatusBucket, string> = {
    pending: copy.orderStatusPending,
    processing: copy.orderStatusProcessing,
    completed: copy.orderStatusCompleted,
    cancelled: copy.orderStatusCancelled,
    other: copy.orderStatusOther,
  };

  return (
    <Card className={ANALYTICS_PANEL_CLASS}>
      <div className={ANALYTICS_ACCENT_SKY} />
      <h2 className="mb-2 text-xl font-semibold text-marco-ink">
        {copy.orderStatusBreakdownTitle}
      </h2>
      <p className="mb-4 text-sm text-marco-slate/75">{copy.orderStatusBreakdownHint}</p>
      <div className={ANALYTICS_TABLE_WRAP}>
        <table className="min-w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200/80 bg-marco-gray/30">
              <th className="px-3 py-2 font-medium text-marco-slate/75">
                {copy.orderStatusColumn}
              </th>
              <th className="px-2 py-2 text-right font-medium text-marco-slate/75">
                {copy.today}
              </th>
              <th className="px-2 py-2 text-right font-medium text-marco-slate/75">
                {copy.last7}
              </th>
              <th className="px-3 py-2 text-right font-medium text-marco-slate/75">
                {copy.last30}
              </th>
            </tr>
          </thead>
          <tbody>
            {ANALYTICS_STATUS_BUCKETS.map((key) => (
              <tr key={key} className="border-b border-gray-200/60">
                <td className="px-3 py-2 text-marco-ink">{labels[key]}</td>
                <td className="px-2 py-2 text-right tabular-nums">{today.byStatus[key]}</td>
                <td className="px-2 py-2 text-right tabular-nums">{week.byStatus[key]}</td>
                <td className="px-3 py-2 text-right tabular-nums">{month.byStatus[key]}</td>
              </tr>
            ))}
            <tr className="bg-marco-yellow/10 font-semibold text-marco-ink">
              <td className="px-3 py-2">{copy.orderStatusTotal}</td>
              <td className="px-2 py-2 text-right tabular-nums">{today.totalOrders}</td>
              <td className="px-2 py-2 text-right tabular-nums">{week.totalOrders}</td>
              <td className="px-3 py-2 text-right tabular-nums">{month.totalOrders}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  );
}
