import {
  createDraftProductTag,
  isProductWarrantyYears,
  MAX_PRODUCT_TAGS,
  type ProductSalesClass,
  type ProductTag,
  type ProductWarrantyYears,
} from "@/features/products/domain/product-presentation";
import { ProductDrawerSegmentedControl } from "@/features/products/ui/ProductDrawerSegmentedControl";
import { ProductDrawerTagCard } from "@/features/products/ui/ProductDrawerTagCard";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

type EditorCopy = Dictionary["admin"]["productEditor"];

type ProductDrawerBasicsTabProps = {
  salesClass: ProductSalesClass;
  warrantyYears: ProductWarrantyYears;
  tags: ProductTag[];
  disabled: boolean;
  copy: EditorCopy;
  onSalesClassChange: (value: ProductSalesClass) => void;
  onWarrantyYearsChange: (value: ProductWarrantyYears) => void;
  onTagsChange: (tags: ProductTag[]) => void;
};

const WARRANTY_VALUES = ["0", "1", "2", "3"] as const;

export function ProductDrawerBasicsTab({
  salesClass,
  warrantyYears,
  tags,
  disabled,
  copy,
  onSalesClassChange,
  onWarrantyYearsChange,
  onTagsChange,
}: ProductDrawerBasicsTabProps) {
  const canAddTag = tags.length < MAX_PRODUCT_TAGS;

  function updateTag(index: number, next: ProductTag): void {
    onTagsChange(tags.map((tag, tagIndex) => (tagIndex === index ? next : tag)));
  }

  function removeTag(index: number): void {
    onTagsChange(tags.filter((_, tagIndex) => tagIndex !== index));
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-800">
            {copy.salesClassTitle}
          </h3>
          <p className="mt-1 mb-4 text-sm text-slate-400">{copy.salesClassHint}</p>
          <ProductDrawerSegmentedControl
            ariaLabel={copy.salesClassTitle}
            value={salesClass}
            disabled={disabled}
            onChange={onSalesClassChange}
            options={[
              { value: "RETAIL", label: copy.retail },
              { value: "WHOLESALE", label: copy.wholesale },
            ]}
          />
        </section>

        <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-800">
            {copy.warrantyTitle}
          </h3>
          <p className="mt-1 mb-4 text-sm text-slate-400">{copy.warrantyHint}</p>
          <ProductDrawerSegmentedControl
            ariaLabel={copy.warrantyTitle}
            value={String(warrantyYears)}
            disabled={disabled}
            onChange={(value) => {
              const years = Number(value);
              onWarrantyYearsChange(isProductWarrantyYears(years) ? years : 0);
            }}
            options={WARRANTY_VALUES.map((value) => ({
              value,
              label:
                value === "0"
                  ? copy.warrantyNone
                  : copy[`warranty${value}` as "warranty1" | "warranty2" | "warranty3"],
            }))}
          />
        </section>
      </div>

      <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-800">
              {copy.tagsTitle}
            </h3>
            <p className="mt-1 max-w-3xl text-sm text-slate-400">{copy.tagsHint}</p>
          </div>
          <button
            type="button"
            disabled={disabled || !canAddTag}
            onClick={() => onTagsChange([...tags, createDraftProductTag()])}
            className="rounded-xl bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 disabled:opacity-50"
          >
            {copy.addTag}
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {tags.map((tag, index) => (
            <ProductDrawerTagCard
              key={tag.id}
              index={index}
              tag={tag}
              disabled={disabled}
              copy={copy}
              onChange={(next) => updateTag(index, next)}
              onRemove={() => removeTag(index)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
