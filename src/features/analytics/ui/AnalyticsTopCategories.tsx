import { Card } from "@/components/ui/Card";
import {
  formatAdminMessage,
  getAdminCopy,
} from "@/features/admin/ui/get-admin-copy";
import type { AnalyticsTopCategory } from "@/features/analytics/application/top-rankings";
import {
  ANALYTICS_ACCENT_CLASS,
  ANALYTICS_PANEL_CLASS,
  ANALYTICS_ROW_CLASS,
  ANALYTICS_SECTION_ICON,
} from "@/features/analytics/ui/analytics-card-classes";
import { AnalyticsRankBadge } from "@/features/analytics/ui/AnalyticsRankBadge";

type AnalyticsTopCategoriesProps = {
  locale: string;
  categories: AnalyticsTopCategory[];
  formatMoney: (amount: number) => string;
};

export function AnalyticsTopCategories({
  locale,
  categories,
  formatMoney,
}: AnalyticsTopCategoriesProps) {
  const copy = getAdminCopy(locale).analytics;

  return (
    <Card className={ANALYTICS_PANEL_CLASS}>
      <div className={ANALYTICS_ACCENT_CLASS} />
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-marco-ink">{copy.topCategories}</h2>
        <div className={ANALYTICS_SECTION_ICON}>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
            />
          </svg>
        </div>
      </div>
      <div className="space-y-3">
        {categories.map((category, index) => (
          <div key={category.categoryId} className={`${ANALYTICS_ROW_CLASS} justify-between`}>
            <div className="flex min-w-0 items-center gap-4">
              <AnalyticsRankBadge rank={index + 1} />
              <div className="min-w-0">
                <p className="mb-1 truncate text-sm font-semibold text-marco-ink">
                  {category.title}
                </p>
                <p className="flex flex-wrap items-center gap-3 text-xs text-marco-slate/75">
                  <span>
                    {formatAdminMessage(copy.itemsCount, { count: category.itemCount })}
                  </span>
                  <span>
                    {formatAdminMessage(copy.ordersCount, { count: category.orderCount })}
                  </span>
                </p>
              </div>
            </div>
            <p className="shrink-0 text-sm font-bold text-marco-ink">
              {formatMoney(category.revenueAmount)}
            </p>
          </div>
        ))}
        {categories.length === 0 ? (
          <p className="py-8 text-center text-sm text-marco-slate/70">
            {copy.noCategorySales}
          </p>
        ) : null}
      </div>
    </Card>
  );
}
