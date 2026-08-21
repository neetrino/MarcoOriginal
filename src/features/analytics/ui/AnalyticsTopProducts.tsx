import { Card } from "@/components/ui/Card";
import { getAdminCopy } from "@/features/admin/ui/get-admin-copy";
import type { AnalyticsTopProduct } from "@/features/analytics/application/top-rankings";
import {
  ANALYTICS_ACCENT_CLASS,
  ANALYTICS_PANEL_CLASS,
  ANALYTICS_SECTION_ICON,
} from "@/features/analytics/ui/analytics-card-classes";
import { AnalyticsProductRow } from "@/features/analytics/ui/AnalyticsProductRow";

type AnalyticsTopProductsProps = {
  locale: string;
  products: AnalyticsTopProduct[];
  formatMoney: (amount: number) => string;
};

export function AnalyticsTopProducts({
  locale,
  products,
  formatMoney,
}: AnalyticsTopProductsProps) {
  const copy = getAdminCopy(locale).analytics;

  return (
    <Card className={ANALYTICS_PANEL_CLASS}>
      <div className={ANALYTICS_ACCENT_CLASS} />
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-marco-ink">{copy.topProducts}</h2>
        <div className={ANALYTICS_SECTION_ICON}>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
      </div>
      <div className="space-y-3">
        {products.map((product, index) => (
          <AnalyticsProductRow
            key={product.productId}
            locale={locale}
            product={product}
            rank={index + 1}
            formatMoney={formatMoney}
          />
        ))}
        {products.length === 0 ? (
          <p className="py-8 text-center text-sm text-marco-slate/70">
            {copy.noProductSales}
          </p>
        ) : null}
      </div>
    </Card>
  );
}
