import { ShieldCheck } from "lucide-react";

import type { ProductTag } from "@/db/schema";
import {
  contrastTextOnHex,
  productTagLabel,
} from "@/features/products/domain/product-presentation";
import {
  PDP_WARRANTY_BADGE_RADIUS_PX,
  PDP_WARRANTY_PROMO_MIN_WIDTH_PX,
} from "@/features/products/ui/product-pdp.constants";

type ProductCardTagsProps = {
  tags: readonly ProductTag[];
};

export function ProductCardTags({ tags }: ProductCardTagsProps) {
  if (tags.length === 0) return null;

  return (
    <ul className="flex flex-col items-start gap-1">
      {tags.map((tag) => {
        const background = tag.color ?? "#FFCA03";
        const color = contrastTextOnHex(background);
        return (
          <li key={tag.id}>
            <span
              className="inline-flex rounded-md px-2 py-0.5 text-xs font-semibold"
              style={{ backgroundColor: background, color }}
            >
              {productTagLabel(tag)}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

type ProductCardAvailabilityProps = {
  inStock: boolean;
  inStockLabel: string;
  outOfStockLabel: string;
  warrantyLabel: string | null;
};

export function ProductCardAvailability({
  inStock,
  inStockLabel,
  outOfStockLabel,
  warrantyLabel,
}: ProductCardAvailabilityProps) {
  return (
    <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium">
      <span className={inStock ? "text-green-700" : "text-red-700"}>
        {inStock ? inStockLabel : outOfStockLabel}
      </span>
      {warrantyLabel ? (
        <span className="inline-flex items-center gap-1 text-slate-600">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
          {warrantyLabel}
        </span>
      ) : null}
    </div>
  );
}

export function warrantyLabelForYears(
  years: number,
  labels: { warranty1: string; warranty2: string; warranty3: string },
): string | null {
  if (years === 1) return labels.warranty1;
  if (years === 2) return labels.warranty2;
  if (years === 3) return labels.warranty3;
  return null;
}

type ProductWarrantyBadgeProps = {
  yearsLabel: string;
  caption: string;
  years?: number;
  yearsSuffix?: string;
  size?: "default" | "promo";
  className?: string;
};

export function ProductWarrantyBadge({
  yearsLabel,
  caption,
  years,
  yearsSuffix,
  size = "default",
  className = "",
}: ProductWarrantyBadgeProps) {
  if (size === "promo" && years != null && yearsSuffix) {
    return (
      <div
        className={`flex shrink-0 flex-col overflow-hidden bg-marco-slate text-center ${className}`}
        style={{
          minWidth: PDP_WARRANTY_PROMO_MIN_WIDTH_PX,
          borderRadius: PDP_WARRANTY_BADGE_RADIUS_PX,
        }}
        aria-label={`${yearsLabel} ${caption}`}
      >
        <div className="flex items-end justify-center gap-0.5 px-2 pt-1.5 pb-1">
          <span className="text-[28px] leading-none font-bold text-marco-yellow uppercase md:text-[32px]">
            {years}
          </span>
          <span className="text-[0.875rem] leading-[0.9375rem] font-normal text-white uppercase">
            {yearsSuffix}
          </span>
        </div>
        <div className="bg-marco-yellow px-2 py-0.5">
          <span className="block text-[10px] leading-[15px] font-bold text-marco-slate uppercase md:text-[11px]">
            {caption}
          </span>
        </div>
      </div>
    );
  }

  return (
    <p
      className={`shrink-0 rounded-xl bg-marco-yellow px-3 py-2 text-center text-marco-slate ${className}`}
      aria-label={`${yearsLabel} ${caption}`}
    >
      <span className="block text-sm leading-tight font-bold">{yearsLabel}</span>
      <span className="mt-1 block text-[10px] font-bold tracking-wide uppercase">
        {caption}
      </span>
    </p>
  );
}

