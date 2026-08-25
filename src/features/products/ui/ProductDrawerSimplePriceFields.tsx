import { ADMIN_INPUT, ADMIN_LABEL } from "@/features/admin/ui/admin-form-classes";
import { MAX_PRODUCT_DISCOUNT_PERCENT } from "@/features/products/domain/product-discount";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

type EditorCopy = Dictionary["admin"]["productEditor"];

type ProductDrawerSimplePriceFieldsProps = {
  copy: EditorCopy;
  priceAmount: string;
  discountPercent: string;
  sku: string;
  disabled: boolean;
  onPriceAmountChange: (value: string) => void;
  onDiscountPercentChange: (value: string) => void;
  onSkuChange: (value: string) => void;
};

export function ProductDrawerSimplePriceFields({
  copy,
  priceAmount,
  discountPercent,
  sku,
  disabled,
  onPriceAmountChange,
  onDiscountPercentChange,
  onSkuChange,
}: ProductDrawerSimplePriceFieldsProps) {
  return (
    <>
      <div className="grid items-end gap-4 lg:grid-cols-[minmax(0,1fr)_auto]">
        <label>
          <span className={ADMIN_LABEL}>
            {copy.priceLabel} <span className="text-red-600">*</span>
          </span>
          <div className="relative">
            <input
              required
              min={0}
              step={1}
              type="number"
              inputMode="numeric"
              placeholder="0.00"
              value={priceAmount}
              onChange={(event) => onPriceAmountChange(event.target.value)}
              className={`${ADMIN_INPUT} pr-12`}
              disabled={disabled}
            />
            <span className="pointer-events-none absolute inset-y-0 right-5 flex items-center text-sm text-slate-400">
              ֏
            </span>
          </div>
        </label>

        <label>
          <span className={ADMIN_LABEL}>{copy.discountLabel}</span>
          <span className="flex items-center gap-2">
            <span className="inline-flex h-12 items-center rounded-full border border-gray-200 bg-white px-4 text-sm text-gray-700 shadow-sm">
              %
            </span>
            <input
              min={0}
              max={MAX_PRODUCT_DISCOUNT_PERCENT}
              step={1}
              type="number"
              inputMode="numeric"
              value={discountPercent}
              onChange={(event) => onDiscountPercentChange(event.target.value)}
              placeholder="0"
              className="h-12 w-24 rounded-full border border-marco-yellow bg-white px-3 text-center text-sm text-gray-900 placeholder:text-slate-400 shadow-sm outline-none"
              disabled={disabled}
            />
          </span>
        </label>
      </div>

      <label>
        <span className={ADMIN_LABEL}>
          {copy.skuLabel}: <span className="text-red-600">*</span>
        </span>
        <input
          required
          value={sku}
          placeholder={copy.skuPlaceholder}
          onChange={(event) => onSkuChange(event.target.value)}
          className={ADMIN_INPUT}
          disabled={disabled}
        />
      </label>
    </>
  );
}
