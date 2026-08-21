import Image from "next/image";
import Link from "next/link";

import { Card } from "@/components/ui/Card";
import {
  formatAdminMessage,
  getAdminCopy,
} from "@/features/admin/ui/get-admin-copy";
import type {
  AnalyticsStockBlock,
  AnalyticsStockList,
} from "@/features/analytics/application/stock-analytics";
import { analyticsLowStockMax } from "@/features/analytics/domain/analytics-display";
import {
  ANALYTICS_ACCENT_CLASS,
  ANALYTICS_PANEL_CLASS,
  ANALYTICS_TABLE_WRAP,
} from "@/features/analytics/ui/analytics-card-classes";

type AnalyticsStockSectionProps = {
  locale: string;
  data: AnalyticsStockBlock;
};

function StockTable({
  locale,
  title,
  hint,
  emptyLabel,
  list,
}: {
  locale: string;
  title: string;
  hint: string;
  emptyLabel: string;
  list: AnalyticsStockList;
}) {
  const copy = getAdminCopy(locale).analytics;

  return (
    <Card className={ANALYTICS_PANEL_CLASS}>
      <div className={ANALYTICS_ACCENT_CLASS} />
      <h3 className="text-lg font-semibold text-marco-ink">{title}</h3>
      <p className="mt-1 mb-4 text-sm text-marco-slate/70">{hint}</p>
      {list.items.length === 0 ? (
        <p className="py-4 text-sm text-marco-slate/70">{emptyLabel}</p>
      ) : (
        <div className={ANALYTICS_TABLE_WRAP}>
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200/80 bg-marco-gray/30 text-left text-marco-slate/75">
                <th className="px-3 py-2">{copy.stockColumnProduct}</th>
                <th className="px-2 py-2">{copy.skuLabel}</th>
                <th className="px-3 py-2">{copy.stockColumnStock}</th>
              </tr>
            </thead>
            <tbody>
              {list.items.map((row) => (
                <tr key={row.productId} className="border-b border-gray-200/60">
                  <td className="px-3 py-3">
                    <div className="flex min-w-0 items-center gap-3">
                      {row.imageUrl ? (
                        <Image
                          src={row.imageUrl}
                          alt=""
                          width={40}
                          height={40}
                          className="h-10 w-10 shrink-0 rounded-lg object-cover ring-1 ring-gray-200/80"
                        />
                      ) : null}
                      <Link
                        href={`/${locale}/admin/products?q=${encodeURIComponent(row.sku)}`}
                        className="truncate font-medium text-marco-slate/85 hover:text-marco-ink hover:underline"
                      >
                        {row.title}
                      </Link>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-2 py-3 text-marco-slate/80">{row.sku}</td>
                  <td className="px-3 py-3 font-medium text-marco-ink">{row.stockOnHand}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {list.total > 0 ? (
        <p className="mt-4 text-xs text-marco-slate/65">
          {formatAdminMessage(copy.stockShowing, {
            shown: list.items.length,
            total: list.total,
          })}
        </p>
      ) : null}
    </Card>
  );
}

export function AnalyticsStockSection({ locale, data }: AnalyticsStockSectionProps) {
  const copy = getAdminCopy(locale).analytics;
  const maxLow = analyticsLowStockMax(data.lowStockThreshold);

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-marco-ink">{copy.stockTitle}</h2>
        <p className="mt-1 text-sm text-marco-slate/70">
          {formatAdminMessage(copy.stockHint, {
            max: maxLow,
            threshold: data.lowStockThreshold,
          })}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <StockTable
          locale={locale}
          title={copy.stockOutOfStockTitle}
          hint={copy.stockOutOfStockHint}
          emptyLabel={copy.stockEmptyOut}
          list={data.outOfStock}
        />
        <StockTable
          locale={locale}
          title={copy.stockLowStockTitle}
          hint={formatAdminMessage(copy.stockLowStockHint, { max: maxLow })}
          emptyLabel={copy.stockEmptyLow}
          list={data.lowStock}
        />
      </div>
    </div>
  );
}
