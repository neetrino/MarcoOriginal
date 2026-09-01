import { ShieldCheck } from "lucide-react";

import type { ProductTag, ProductTagPosition } from "@/db/schema";
import {
  PRODUCT_TAG_POSITIONS,
  productTagLabel,
} from "@/features/products/domain/product-presentation";
import {
  PDP_WARRANTY_BADGE_RADIUS_PX,
  PDP_WARRANTY_PROMO_MIN_WIDTH_PX,
} from "@/features/products/ui/product-pdp.constants";

type ProductCardTagsProps = {
  tags: readonly ProductTag[];
  className?: string;
  /** Replaces default `top-2` on the top-left stack (cards: sit below warranty). */
  topLeftClassName?: string;
  /** Replaces default `top-2` on the top-right stack (PDP/cards: sit below badges/actions). */
  topRightClassName?: string;
};

function tagFallbackClasses(tag: ProductTag): string {
  if (tag.type === "PERCENT") return "bg-red-600 text-white";

  const value = tag.value.toLowerCase();
  if (value.includes("new") || value.includes("նոր") || value.includes("нов")) {
    return "bg-green-600 text-white";
  }
  if (value.includes("hot") || value.includes("տաք") || value.includes("хит")) {
    return "bg-orange-600 text-white";
  }
  if (
    value.includes("sale") ||
    value.includes("զեղչ") ||
    value.includes("скид")
  ) {
    return "bg-red-600 text-white";
  }

  return "bg-blue-600 text-white";
}

function cornerPositionClasses(
  position: ProductTagPosition,
  options: {
    topLeftClassName?: string;
    topRightClassName?: string;
  },
): string {
  switch (position) {
    case "top-left":
      return `${options.topLeftClassName ?? "top-2"} left-2 items-start`;
    case "top-right":
      return `${options.topRightClassName ?? "top-2"} right-2 items-end`;
    case "bottom-left":
      return "bottom-2 left-2 items-start";
    case "bottom-right":
      return "bottom-2 right-2 items-end";
  }
}

/** Corner-stacked product labels, matching marco.am ProductLabels layout. */
export function ProductCardTags({
  tags,
  className = "z-20",
  topLeftClassName,
  topRightClassName,
}: ProductCardTagsProps) {
  if (tags.length === 0) return null;

  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`}>
      {PRODUCT_TAG_POSITIONS.map((position) => {
        const tagsForPosition = tags.filter((tag) => tag.position === position);
        if (tagsForPosition.length === 0) return null;

        return (
          <div
            key={position}
            className={`absolute flex flex-col gap-1 ${cornerPositionClasses(position, {
              topLeftClassName,
              topRightClassName,
            })}`}
          >
            {tagsForPosition.map((tag) => {
              const hasCustomColor = Boolean(tag.color);
              return (
                <span
                  key={tag.id}
                  className={`inline-flex rounded-md px-3 py-1.5 text-sm font-semibold shadow-sm ${
                    hasCustomColor
                      ? "text-marco-black"
                      : tagFallbackClasses(tag)
                  }`}
                  style={
                    hasCustomColor
                      ? { backgroundColor: tag.color ?? undefined }
                      : undefined
                  }
                >
                  {productTagLabel(tag)}
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
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
