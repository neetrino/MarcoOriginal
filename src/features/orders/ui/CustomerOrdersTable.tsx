"use client";

import {
  formatOrderDrawerMoney,
  formatOrderStatusLabel,
} from "@/features/orders/ui/order-drawer-format";
import { formatShortDate } from "@/features/profile/ui/format-short-date";
import { PROFILE_ORDER_ROW_CLASS } from "@/features/profile/ui/profile-surface-classes";

type CustomerOrderRow = {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  baseCurrency: string;
  placedAt: string | Date;
};

type CustomerOrdersTableProps = {
  locale: string;
  orders: CustomerOrderRow[];
  emptyLabel: string;
  orderNumberLabel: string;
  statusLabel: string;
  paymentLabel: string;
  placedOnLabel: string;
  viewDetailsLabel: string;
  onOpenOrder: (orderNumber: string) => void;
};

export function CustomerOrdersTable({
  locale,
  orders,
  emptyLabel,
  orderNumberLabel,
  statusLabel,
  paymentLabel,
  placedOnLabel,
  viewDetailsLabel,
  onOpenOrder,
}: CustomerOrdersTableProps) {
  if (orders.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-marco-slate/70">{emptyLabel}</p>
    );
  }

  return (
    <ul className="space-y-4">
      {orders.map((order) => (
        <li key={order.id}>
          <button
            type="button"
            onClick={() => onOpenOrder(order.orderNumber)}
            className={`w-full text-left ${PROFILE_ORDER_ROW_CLASS}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-6">
                  <h3 className="text-lg font-semibold text-marco-slate">
                    {orderNumberLabel} {order.orderNumber}
                  </h3>
                  <div>
                    <p className="mb-0.5 text-[11px] tracking-wide text-marco-slate/50 uppercase">
                      {statusLabel}
                    </p>
                    <span className="inline-flex rounded-full bg-marco-gray px-2 py-1 text-xs font-medium text-marco-slate capitalize">
                      {formatOrderStatusLabel(order.status)}
                    </span>
                  </div>
                  <div>
                    <p className="mb-0.5 text-[11px] tracking-wide text-marco-slate/50 uppercase">
                      {paymentLabel}
                    </p>
                    <span className="inline-flex rounded-full bg-marco-gray px-2 py-1 text-xs font-medium text-marco-slate capitalize">
                      {formatOrderStatusLabel(order.paymentStatus)}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-marco-slate/70">
                  {placedOnLabel} {formatShortDate(order.placedAt, locale)}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-lg font-bold text-marco-slate">
                  {formatOrderDrawerMoney(order.totalAmount, order.baseCurrency)}
                </p>
                <p className="mt-1 text-xs text-marco-slate/50">{viewDetailsLabel}</p>
              </div>
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
}
