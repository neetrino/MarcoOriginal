import { Card } from "@/components/ui/Card";
import { getAdminCopy } from "@/features/admin/ui/get-admin-copy";
import type { AnalyticsTopProduct } from "@/features/analytics/application/top-rankings";
import {
  ANALYTICS_ACCENT_AMBER,
  ANALYTICS_PANEL_CLASS,
} from "@/features/analytics/ui/analytics-card-classes";
import { AnalyticsProductRow } from "@/features/analytics/ui/AnalyticsProductRow";

type AnalyticsLeastSellingProps = {
  locale: string;
  products: AnalyticsTopProduct[];
  formatMoney: (amount: number) => string;
};

export function AnalyticsLeastSelling({
  locale,
  products,
  formatMoney,
}: AnalyticsLeastSellingProps) {
  const copy = getAdminCopy(locale).analytics;

  return (
    <Card className={ANALYTICS_PANEL_CLASS}>
      <div className={ANALYTICS_ACCENT_AMBER} />
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-marco-ink">
          {copy.leastSellingProducts}
        </h2>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
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
            tone="amber"
          />
        ))}
        {products.length === 0 ? (
          <p className="py-8 text-center text-sm text-marco-slate/70">
            {copy.noLeastSellingData}
          </p>
        ) : null}
      </div>
    </Card>
  );
}
