import { Card } from "@/components/ui/Card";
import {
  formatAdminMessage,
  getAdminCopy,
} from "@/features/admin/ui/get-admin-copy";
import type { AnalyticsCustomerBlock } from "@/features/analytics/application/customer-analytics";
import {
  ANALYTICS_ACCENT_CYAN,
  ANALYTICS_ACCENT_EMERALD,
  ANALYTICS_PANEL_CLASS,
  ANALYTICS_TABLE_WRAP,
} from "@/features/analytics/ui/analytics-card-classes";

type AnalyticsCustomerSectionProps = {
  locale: string;
  data: AnalyticsCustomerBlock;
  formatMoney: (amount: number) => string;
};

export function AnalyticsCustomerSection({
  locale,
  data,
  formatMoney,
}: AnalyticsCustomerSectionProps) {
  const copy = getAdminCopy(locale).analytics;
  const { newVsRepeat, topCustomersBySpend } = data;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card className={ANALYTICS_PANEL_CLASS}>
        <div className={ANALYTICS_ACCENT_EMERALD} />
        <h3 className="mb-2 text-lg font-semibold text-marco-ink">
          {copy.customerNewVsRepeatTitle}
        </h3>
        <p className="mb-4 text-sm text-marco-slate/75">{copy.customerNewVsRepeatHint}</p>
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-3">
            <dt className="font-medium text-emerald-800">{copy.customerNewCustomers}</dt>
            <dd className="text-2xl font-bold text-emerald-900">{newVsRepeat.newCustomers}</dd>
          </div>
          <div className="rounded-lg border border-sky-100 bg-sky-50 p-3">
            <dt className="font-medium text-sky-800">{copy.customerRepeatCustomers}</dt>
            <dd className="text-2xl font-bold text-sky-900">{newVsRepeat.repeatCustomers}</dd>
          </div>
          <div className="col-span-2 grid grid-cols-2 gap-2 border-t border-gray-200/80 pt-2">
            <div>
              <dt className="text-marco-slate/70">{copy.customerOrdersFromNew}</dt>
              <dd className="font-semibold text-marco-ink">
                {newVsRepeat.ordersFromNewCustomers}
              </dd>
            </div>
            <div>
              <dt className="text-marco-slate/70">{copy.customerOrdersFromRepeat}</dt>
              <dd className="font-semibold text-marco-ink">
                {newVsRepeat.ordersFromRepeatCustomers}
              </dd>
            </div>
          </div>
        </dl>
      </Card>

      <Card className={ANALYTICS_PANEL_CLASS}>
        <div className={ANALYTICS_ACCENT_CYAN} />
        <h3 className="mb-2 text-lg font-semibold text-marco-ink">
          {copy.topCustomersBySpendTitle}
        </h3>
        <p className="mb-4 text-sm text-marco-slate/75">{copy.topCustomersBySpendHint}</p>
        {topCustomersBySpend.length === 0 ? (
          <p className="text-sm text-marco-slate/70">{copy.noTopCustomers}</p>
        ) : (
          <div className={ANALYTICS_TABLE_WRAP}>
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200/80 text-left text-marco-slate/70">
                  <th className="px-3 py-2 font-medium">{copy.topCustomersColumnCustomer}</th>
                  <th className="px-2 py-2 text-right font-medium">
                    {copy.topCustomersColumnSpend}
                  </th>
                  <th className="px-3 py-2 text-right font-medium">
                    {copy.topCustomersColumnOrders}
                  </th>
                </tr>
              </thead>
              <tbody>
                {topCustomersBySpend.map((row) => (
                  <tr
                    key={`${row.identityType}-${row.userId ?? row.email}`}
                    className="border-b border-gray-200/60"
                  >
                    <td className="px-3 py-2 text-marco-ink">{row.displayName}</td>
                    <td className="px-2 py-2 text-right tabular-nums">
                      {formatMoney(row.totalSpend)}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">{row.orderCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {newVsRepeat.ordersUnattributed > 0 ? (
          <p className="mt-3 rounded border border-amber-100 bg-amber-50 p-2 text-xs text-amber-800">
            {formatAdminMessage(copy.customerUnattributedOrders, {
              count: newVsRepeat.ordersUnattributed,
            })}
          </p>
        ) : null}
      </Card>
    </div>
  );
}
