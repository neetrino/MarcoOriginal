import Image from "next/image";

import {
  formatAdminMessage,
  getAdminCopy,
} from "@/features/admin/ui/get-admin-copy";
import type { AnalyticsTopProduct } from "@/features/analytics/application/top-rankings";
import {
  ANALYTICS_ROW_AMBER_CLASS,
  ANALYTICS_ROW_CLASS,
} from "@/features/analytics/ui/analytics-card-classes";
import { AnalyticsRankBadge } from "@/features/analytics/ui/AnalyticsRankBadge";

type AnalyticsProductRowProps = {
  locale: string;
  product: AnalyticsTopProduct;
  rank: number;
  formatMoney: (amount: number) => string;
  tone?: "default" | "amber";
};

export function AnalyticsProductRow({
  locale,
  product,
  rank,
  formatMoney,
  tone = "default",
}: AnalyticsProductRowProps) {
  const copy = getAdminCopy(locale).analytics;
  const rowClass = tone === "amber" ? ANALYTICS_ROW_AMBER_CLASS : ANALYTICS_ROW_CLASS;

  return (
    <div className={rowClass}>
      <AnalyticsRankBadge rank={rank} muted={tone === "amber"} />
      {product.imageUrl ? (
        <Image
          src={product.imageUrl}
          alt=""
          width={56}
          height={56}
          className="h-14 w-14 shrink-0 rounded-lg object-cover ring-1 ring-gray-200/80"
        />
      ) : null}
      <div className="min-w-0 flex-1">
        <p className="mb-1 truncate text-sm font-semibold text-marco-ink">
          {product.title}
        </p>
        <p className="mb-1 text-xs text-marco-slate/70">
          {copy.skuLabel}: {product.sku}
        </p>
        <p className="flex flex-wrap items-center gap-3 text-xs text-marco-slate/75">
          <span>{formatAdminMessage(copy.sold, { count: product.quantitySold })}</span>
          <span>
            {formatAdminMessage(copy.ordersCount, { count: product.orderCount })}
          </span>
        </p>
      </div>
      <p className="shrink-0 text-base font-bold text-marco-ink">
        {formatMoney(product.revenueAmount)}
      </p>
    </div>
  );
}
