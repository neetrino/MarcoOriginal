import Link from "next/link";

import { Card } from "@/components/ui/Card";
import { formatDashboardDate } from "@/features/admin/domain/dashboard-display";
import {
  DASHBOARD_PANEL_CLASS,
  DASHBOARD_ROW_CLASS,
  DASHBOARD_VIEW_ALL_CLASS,
} from "@/features/admin/ui/dashboard-card-classes";
import {
  formatAdminMessage,
  getAdminCopy,
} from "@/features/admin/ui/get-admin-copy";
import {
  ADMIN_BADGE,
  paymentStatusBadgeClass,
} from "@/features/admin/ui/status-badge";
import type { AdminOrderListItem } from "@/features/orders/application/queries";
import { paymentStatusLabel } from "@/features/orders/domain/payment-status";

type DashboardRecentOrdersProps = {
  locale: string;
  orders: AdminOrderListItem[];
  formatAmount: (amount: number, currency: string) => string;
};

export function DashboardRecentOrders({
  locale,
  orders,
  formatAmount,
}: DashboardRecentOrdersProps) {
  const copy = getAdminCopy(locale).dashboard;

  return (
    <Card className={DASHBOARD_PANEL_CLASS}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-marco-ink">
          {copy.recentOrders}
        </h2>
        <Link
          href={`/${locale}/admin/orders`}
          className={DASHBOARD_VIEW_ALL_CLASS}
        >
          {copy.viewAll}
        </Link>
      </div>
      <div className="space-y-3">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/${locale}/admin/orders/${order.orderNumber}`}
            className={DASHBOARD_ROW_CLASS}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-marco-ink">
                    #{order.orderNumber}
                  </p>
                  <span
                    className={`${ADMIN_BADGE} ${paymentStatusBadgeClass(order.paymentStatus)}`}
                  >
                    {paymentStatusLabel(order.paymentStatus)}
                  </span>
                </div>
                <p className="truncate text-xs text-marco-slate/70">
                  {order.contactEmail || order.contactName || copy.guest}
                </p>
                <p className="mt-1 text-xs text-marco-slate/55">
                  {formatAdminMessage(
                    order.itemsCount === 1 ? copy.items : copy.itemsPlural,
                    { count: order.itemsCount },
                  )}{" "}
                  • {formatDashboardDate(order.placedAt, locale)}
                </p>
              </div>
              <p className="shrink-0 text-sm font-semibold text-marco-ink">
                {formatAmount(order.totalAmount, order.baseCurrency)}
              </p>
            </div>
          </Link>
        ))}
        {orders.length === 0 ? (
          <p className="py-8 text-center text-sm text-marco-slate/65">
            {copy.noRecentOrders}
          </p>
        ) : null}
      </div>
    </Card>
  );
}
