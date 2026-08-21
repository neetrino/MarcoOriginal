import Image from "next/image";
import Link from "next/link";

import { Card } from "@/components/ui/Card";
import type { AnalyticsTopProduct } from "@/features/analytics/application/top-rankings";
import {
  DASHBOARD_PANEL_CLASS,
  DASHBOARD_ROW_CLASS,
  DASHBOARD_VIEW_ALL_CLASS,
} from "@/features/admin/ui/dashboard-card-classes";
import {
  formatAdminMessage,
  getAdminCopy,
} from "@/features/admin/ui/get-admin-copy";

type DashboardTopProductsProps = {
  locale: string;
  products: AnalyticsTopProduct[];
  formatAmount: (amount: number, currency: string) => string;
  currency: string;
};

export function DashboardTopProducts({
  locale,
  products,
  formatAmount,
  currency,
}: DashboardTopProductsProps) {
  const copy = getAdminCopy(locale).dashboard;

  return (
    <Card className={DASHBOARD_PANEL_CLASS}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-marco-ink">
          {copy.topSellingProducts}
        </h2>
        <Link
          href={`/${locale}/admin/products`}
          className={DASHBOARD_VIEW_ALL_CLASS}
        >
          {copy.viewAll}
        </Link>
      </div>
      <div className="space-y-3">
        {products.map((product, index) => (
          <Link
            key={product.productId}
            href={`/${locale}/admin/products`}
            className={`${DASHBOARD_ROW_CLASS} flex items-center gap-4 p-3`}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-marco-yellow/25 text-xs font-bold text-marco-ink/70">
              {index + 1}
            </div>
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.title}
                width={48}
                height={48}
                className="h-12 w-12 shrink-0 rounded-xl object-cover ring-1 ring-gray-200/80"
              />
            ) : null}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-marco-ink">
                {product.title}
              </p>
              <p className="text-xs text-marco-slate/70">
                {formatAdminMessage(copy.sku, { sku: product.sku })}
              </p>
              <p className="mt-1 text-xs text-marco-slate/55">
                {formatAdminMessage(copy.sold, {
                  count: product.quantitySold,
                })}{" "}
                •{" "}
                {formatAdminMessage(copy.ordersCount, {
                  count: product.orderCount,
                })}
              </p>
            </div>
            <p className="shrink-0 text-sm font-semibold text-marco-ink">
              {formatAmount(product.revenueAmount, currency)}
            </p>
          </Link>
        ))}
        {products.length === 0 ? (
          <p className="py-8 text-center text-sm text-marco-slate/65">
            {copy.noSalesData}
          </p>
        ) : null}
      </div>
    </Card>
  );
}
