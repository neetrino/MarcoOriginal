import { Card } from "@/components/ui/Card";
import type { DashboardSalesWidgets as SalesWidgets } from "@/features/admin/application/dashboard-sales-widgets";
import {
  formatAdminMessage,
  getAdminCopy,
} from "@/features/admin/ui/get-admin-copy";

type DashboardSalesWidgetsProps = {
  locale: string;
  widgets: SalesWidgets;
  todayLabel: string;
  monthLabel: string;
  topProductLabel: string;
};

function SalesWidgetCard({
  className,
  labelClass,
  valueClass,
  hintClass,
  label,
  value,
  detail,
  hint,
}: {
  className: string;
  labelClass: string;
  valueClass: string;
  hintClass: string;
  label: string;
  value: string;
  detail?: string;
  hint: string;
}) {
  return (
    <Card className={className}>
      <p className={labelClass}>{label}</p>
      <p className={valueClass}>{value}</p>
      {detail ? (
        <p className="mt-1 text-sm text-indigo-800">{detail}</p>
      ) : null}
      {hint ? <p className={hintClass}>{hint}</p> : null}
    </Card>
  );
}

export function DashboardSalesWidgets({
  locale,
  widgets,
  todayLabel,
  monthLabel,
  topProductLabel,
}: DashboardSalesWidgetsProps) {
  const copy = getAdminCopy(locale).dashboard;
  const top = widgets.topProduct;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <SalesWidgetCard
        className="overflow-hidden rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-white to-emerald-50/60 p-6 shadow-sm"
        labelClass="text-sm font-medium text-emerald-800"
        valueClass="mt-1 text-2xl font-bold text-emerald-900"
        hintClass="mt-1 text-xs text-emerald-700"
        label={copy.todaySales}
        value={todayLabel}
        hint={formatAdminMessage(copy.ordersCount, {
          count: widgets.todaySales.paidOrders,
        })}
      />
      <SalesWidgetCard
        className="overflow-hidden rounded-2xl border border-cyan-200/80 bg-gradient-to-br from-white to-cyan-50/60 p-6 shadow-sm"
        labelClass="text-sm font-medium text-cyan-800"
        valueClass="mt-1 text-2xl font-bold text-cyan-900"
        hintClass="mt-1 text-xs text-cyan-700"
        label={copy.monthlySales}
        value={monthLabel}
        hint={formatAdminMessage(copy.ordersCount, {
          count: widgets.monthlySales.paidOrders,
        })}
      />
      <SalesWidgetCard
        className="overflow-hidden rounded-2xl border border-indigo-200/80 bg-gradient-to-br from-white to-indigo-50/60 p-6 shadow-sm"
        labelClass="text-sm font-medium text-indigo-800"
        valueClass="mt-1 truncate text-base font-semibold text-indigo-900"
        hintClass="mt-1 text-xs text-indigo-700"
        label={copy.topProduct}
        value={top ? top.title : copy.topProductNone}
        detail={top ? topProductLabel : undefined}
        hint={
          top
            ? formatAdminMessage(copy.sold, { count: top.totalQuantity })
            : ""
        }
      />
    </div>
  );
}
