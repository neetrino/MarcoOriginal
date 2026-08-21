import Link from "next/link";
import { Info } from "lucide-react";

import { getAdminCopy } from "@/features/admin/ui/get-admin-copy";
import {
  DISCOUNT_ICON_SKY,
  DISCOUNT_INFO_CARD,
} from "@/features/promotions/ui/discount-admin.classes";

type DiscountInfoCardProps = {
  locale: string;
};

export function DiscountInfoCard({ locale }: DiscountInfoCardProps) {
  const copy = getAdminCopy(locale).discounts;
  const infoPoints = [copy.info1, copy.info2, copy.info3, copy.info4] as const;

  return (
    <article className={`flex h-full flex-col ${DISCOUNT_INFO_CARD}`}>
      <div className="mb-4 flex items-center gap-3">
        <span className={DISCOUNT_ICON_SKY}>
          <Info className="h-4 w-4" aria-hidden />
        </span>
        <div>
          <h2 className="text-base font-semibold tracking-tight text-marco-ink">
            {copy.infoTitle}
          </h2>
          <p className="text-xs text-gray-500">{copy.infoSubtitle}</p>
        </div>
      </div>

      <ul className="flex-1 space-y-2 rounded-lg border border-sky-100/80 bg-white/80 p-3 text-sm text-gray-600">
        {infoPoints.map((point) => (
          <li key={point} className="flex items-start gap-2">
            <span className="mt-0.5 font-semibold text-sky-600" aria-hidden>
              •
            </span>
            <span>{point}</span>
          </li>
        ))}
      </ul>

      <div className="mt-4 border-t border-sky-100 pt-4">
        <Link
          href={`/${locale}/admin/settings`}
          className="flex w-full items-center justify-center rounded-xl border border-sky-100 bg-white px-3 py-2 text-sm font-medium text-marco-slate transition-colors hover:bg-sky-50"
        >
          {copy.moreSettings}
        </Link>
      </div>
    </article>
  );
}
