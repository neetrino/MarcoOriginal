import { ADMIN_INPUT, ADMIN_LABEL } from "@/features/admin/ui/admin-form-classes";
import type { AdminCategoryOption } from "@/features/products/application/list-admin-products";
import { MAX_PRODUCT_DISCOUNT_PERCENT } from "@/features/products/domain/product-discount";
import { ProductDrawerCategories } from "@/features/products/ui/ProductDrawerCategories";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

type EditorCopy = Dictionary["admin"]["productEditor"];

type ProductDrawerPriceTabProps = {
  locale: string;
  copy: EditorCopy;
  priceAmount: string;
  discountPercent: string;
  sku: string;
  categories: AdminCategoryOption[];
  categoryIds: string[];
  disabled: boolean;
  onPriceAmountChange: (value: string) => void;
  onDiscountPercentChange: (value: string) => void;
  onSkuChange: (value: string) => void;
  onCategoriesChange: (categories: AdminCategoryOption[]) => void;
  onCategoryIdsChange: (ids: string[]) => void;
};

export function ProductDrawerPriceTab({
  locale,
  copy,
  priceAmount,
  discountPercent,
  sku,
  categories,
  categoryIds,
  disabled,
  onPriceAmountChange,
  onDiscountPercentChange,
  onSkuChange,
  onCategoriesChange,
  onCategoryIdsChange,
}: ProductDrawerPriceTabProps) {
  return (
    <section className="flex flex-col gap-5">
      <h3 className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
        {copy.priceSectionTitle}
      </h3>

      <div className="grid items-end gap-4 lg:grid-cols-[minmax(0,1fr)_auto]">
        <label>
          <span className={ADMIN_LABEL}>
            {copy.priceLabel} <span className="text-red-600">*</span>
          </span>
          <input
            required
            min={0}
            step={1}
            type="number"
            inputMode="numeric"
            placeholder="0.00"
            value={priceAmount}
            onChange={(event) => onPriceAmountChange(event.target.value)}
            className={ADMIN_INPUT}
            disabled={disabled}
          />
        </label>

        <label>
          <span className={ADMIN_LABEL}>{copy.discountLabel}</span>
          <span className="flex items-center gap-2">
            <span className="inline-flex h-11 items-center rounded-2xl border border-gray-200 bg-white px-3 text-sm text-gray-700 shadow-sm">
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
              className="h-11 w-20 rounded-2xl border border-marco-yellow bg-white px-3 text-center text-sm text-gray-900 shadow-sm outline-none"
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

      <ProductDrawerCategories
        locale={locale}
        categories={categories}
        selectedIds={categoryIds}
        disabled={disabled}
        copy={{
          label: copy.categoriesLabel,
          placeholder: copy.categoriesPlaceholder,
          empty: copy.categoriesEmpty,
          add: copy.addCategory,
          titleLabel: copy.categoryTitleLabel,
          titlePlaceholder: copy.categoryTitlePlaceholder,
          addSubmit: copy.categoryAddSubmit,
          adding: copy.categoryAdding,
          cancel: copy.cancel,
        }}
        onCategoriesChange={onCategoriesChange}
        onSelectedChange={onCategoryIdsChange}
      />
    </section>
  );
}
