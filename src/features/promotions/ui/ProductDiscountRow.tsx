"use client";

import { applyPercentageToListPrice } from "@/features/promotions/domain/resolve-automatic-discount";
import type { DiscountBoardProduct } from "@/features/promotions/application/discounts-board";
import {
  DISCOUNT_FIELD,
  DISCOUNT_PRIMARY_BUTTON,
  DISCOUNT_PRODUCT_ROW,
  DISCOUNT_SALE_BADGE,
} from "@/features/promotions/ui/discount-admin.classes";
import { parseDiscountPercent } from "@/features/promotions/ui/discount-percent";
import { formatMoneyWithSymbol } from "@/lib/money/format";

type ProductDiscountRowProps = {
  product: DiscountBoardProduct;
  locale: string;
  draft: string;
  busy: boolean;
  disabled: boolean;
  discountForLabel: string;
  saveLabel: string;
  onChange: (value: string) => void;
  onSave: () => void;
};

export function ProductDiscountRow({
  product,
  locale,
  draft,
  busy,
  disabled,
  discountForLabel,
  saveLabel,
  onChange,
  onSave,
}: ProductDiscountRowProps) {
  const parsed = parseDiscountPercent(draft);
  const percent = parsed === "invalid" ? null : parsed;
  const pricing = applyPercentageToListPrice(product.priceAmount, percent);
  const hasSale = pricing.compareAtAmount != null;

  return (
    <li className={DISCOUNT_PRODUCT_ROW}>
      <ProductThumb imageUrl={product.imageUrl} title={product.title} />
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-semibold text-marco-ink">
          {product.title}
        </h3>
        <ProductPriceLine
          locale={locale}
          listAmount={product.priceAmount}
          unitAmount={pricing.unitAmount}
          hasSale={hasSale}
          percent={pricing.discountPercent}
        />
      </div>
      <div className="flex items-center gap-2">
        <label className="sr-only" htmlFor={`product-discount-${product.id}`}>
          {discountForLabel}
        </label>
        <input
          id={`product-discount-${product.id}`}
          type="number"
          min={0}
          max={100}
          inputMode="numeric"
          disabled={disabled}
          value={draft}
          placeholder="0"
          onChange={(event) => onChange(event.target.value)}
          className={DISCOUNT_FIELD}
        />
        <span className="text-sm font-semibold text-marco-slate">%</span>
        <button
          type="button"
          disabled={disabled}
          onClick={onSave}
          className={DISCOUNT_PRIMARY_BUTTON}
        >
          {saveLabel}
        </button>
        {busy ? <span className="sr-only">{saveLabel}</span> : null}
      </div>
    </li>
  );
}

function ProductThumb({
  imageUrl,
  title,
}: {
  imageUrl: string | null;
  title: string;
}) {
  if (!imageUrl) {
    return (
      <span
        className="h-16 w-16 shrink-0 rounded-lg border border-gray-200 bg-gray-100"
        aria-hidden
      />
    );
  }

  return (
    // Admin/R2 hosts vary — native img avoids brittle next/image allowlists.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imageUrl}
      alt={title}
      className="h-16 w-16 shrink-0 rounded-lg border border-gray-200 object-cover"
    />
  );
}

function ProductPriceLine({
  locale,
  listAmount,
  unitAmount,
  hasSale,
  percent,
}: {
  locale: string;
  listAmount: number;
  unitAmount: number;
  hasSale: boolean;
  percent: number | null;
}) {
  const current = formatMoneyWithSymbol(unitAmount, "AMD", locale);
  if (!hasSale) {
    return <p className="mt-1 text-xs text-gray-500">{current}</p>;
  }

  return (
    <div className="mt-1 flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold text-marco-slate">{current}</span>
      <span className="text-xs text-gray-400 line-through">
        {formatMoneyWithSymbol(listAmount, "AMD", locale)}
      </span>
      {percent != null ? (
        <span className={DISCOUNT_SALE_BADGE}>-{percent}%</span>
      ) : null}
    </div>
  );
}
