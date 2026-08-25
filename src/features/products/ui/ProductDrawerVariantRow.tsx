"use client";

import { CalendarDays, ImagePlus, Trash2 } from "lucide-react";

import { SelectDropdown } from "@/components/ui/SelectDropdown";
import type { AdminAttributeListItem } from "@/features/attributes/domain/attribute-admin-model";
import { MAX_PRODUCT_DISCOUNT_PERCENT } from "@/features/products/domain/product-discount";
import type { ProductVariantDraft } from "@/features/products/domain/product-variant-draft";
import type { VariantDiscountType } from "@/features/products/domain/variant-discount";
import { ProductDrawerAttributeValueSelect } from "@/features/products/ui/ProductDrawerAttributeValueSelect";
import {
  VARIANT_DISCOUNT_GROUP,
  VARIANT_FIELD_INPUT,
  VARIANT_FIELD_LABEL,
  VARIANT_ROW_SHELL,
} from "@/features/products/ui/product-drawer-variant.classes";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

type EditorCopy = Dictionary["admin"]["productEditor"];

type ProductDrawerVariantRowProps = {
  copy: EditorCopy;
  variant: ProductVariantDraft;
  attributes: readonly AdminAttributeListItem[];
  disabled: boolean;
  onChange: (variant: ProductVariantDraft) => void;
  onRemove: () => void;
};

export function ProductDrawerVariantRow({
  copy,
  variant,
  attributes,
  disabled,
  onChange,
  onRemove,
}: ProductDrawerVariantRowProps) {
  function update(partial: Partial<ProductVariantDraft>): void {
    onChange({ ...variant, ...partial });
  }

  function handleImagePick(event: React.ChangeEvent<HTMLInputElement>): void {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    update({
      image: { key: `${variant.key}-image`, previewUrl, file },
      removeImageId: variant.image?.existingId ?? null,
    });
  }

  return (
    <article className={VARIANT_ROW_SHELL}>
      <div
        className={`grid gap-3 ${
          attributes.length > 1
            ? "sm:grid-cols-2 lg:grid-cols-3"
            : "grid-cols-1"
        }`}
      >
        {attributes.map((attribute) => (
          <div key={attribute.id}>
            <span className={VARIANT_FIELD_LABEL}>{attribute.title}</span>
            <ProductDrawerAttributeValueSelect
              attributeTitle={attribute.title}
              modalTitle={copy.variableSelectValueTitle.replace(
                "{name}",
                attribute.title,
              )}
              closeLabel={copy.variableValueModalClose}
              value={variant.attributeValueIds[attribute.id] ?? ""}
              allLabel={copy.variableValuePlaceholder}
              values={attribute.values}
              disabled={disabled}
              triggerClassName="h-11 rounded-lg border-gray-300"
              onValueChange={(valueId) =>
                update({
                  attributeValueIds: {
                    ...variant.attributeValueIds,
                    [attribute.id]: valueId,
                  },
                })
              }
            />
          </div>
        ))}
      </div>

      <div className="mt-4 grid items-end gap-3 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1.2fr)_auto]">
        <label>
          <span className={VARIANT_FIELD_LABEL}>{copy.priceLabel}</span>
          <div className="relative">
            <input
              min={0}
              step={1}
              type="number"
              inputMode="numeric"
              placeholder="0.00"
              value={variant.priceAmount}
              onChange={(event) => update({ priceAmount: event.target.value })}
              className={`${VARIANT_FIELD_INPUT} pr-10`}
              disabled={disabled}
            />
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-slate-400">
              ֏
            </span>
          </div>
        </label>

        <div>
          <span className={VARIANT_FIELD_LABEL}>{copy.discountLabel}</span>
          <div className={VARIANT_DISCOUNT_GROUP}>
            <SelectDropdown
              ariaLabel={copy.variableDiscountTypeLabel}
              value={variant.discountType}
              options={[
                { label: "%", value: "PERCENTAGE" },
                { label: "֏", value: "FIXED" },
              ]}
              disabled={disabled}
              deferChange={false}
              fitContent
              triggerClassName="h-9 min-h-9 min-w-[3rem] rounded-md border-0 bg-transparent px-2 text-sm shadow-none"
              onValueChange={(next) =>
                update({ discountType: next as VariantDiscountType })
              }
            />
            <input
              min={0}
              max={
                variant.discountType === "PERCENTAGE"
                  ? MAX_PRODUCT_DISCOUNT_PERCENT
                  : undefined
              }
              step={1}
              type="number"
              inputMode="numeric"
              value={variant.discountValue}
              onChange={(event) => update({ discountValue: event.target.value })}
              placeholder="0"
              className="h-9 w-16 rounded-md border-0 bg-transparent px-2 text-center text-sm text-gray-900 placeholder:text-slate-400 outline-none"
              disabled={disabled}
            />
            <label
              className="relative inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-md bg-marco-yellow/15 text-marco-slate"
              title={copy.variableDiscountEndLabel}
            >
              <CalendarDays className="h-4 w-4" aria-hidden />
              <input
                type="datetime-local"
                value={variant.discountEndsAt}
                onChange={(event) =>
                  update({ discountEndsAt: event.target.value })
                }
                className="absolute inset-0 cursor-pointer opacity-0"
                disabled={disabled}
                aria-label={copy.variableDiscountEndLabel}
              />
            </label>
          </div>
        </div>

        <label>
          <span className={VARIANT_FIELD_LABEL}>{copy.skuLabel}</span>
          <input
            value={variant.sku}
            placeholder={copy.skuPlaceholder}
            onChange={(event) => update({ sku: event.target.value })}
            className={VARIANT_FIELD_INPUT}
            disabled={disabled}
          />
        </label>

        <div>
          <span className={VARIANT_FIELD_LABEL}>{copy.variableImageLabel}</span>
          <div className="flex items-center gap-2">
            <label className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white text-slate-500 hover:border-slate-400">
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                disabled={disabled}
                onChange={handleImagePick}
              />
              {variant.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={variant.image.previewUrl}
                  alt=""
                  className="h-full w-full rounded-lg object-cover"
                />
              ) : (
                <ImagePlus className="h-4 w-4" aria-hidden />
              )}
            </label>
            <button
              type="button"
              aria-label={copy.variableRemoveVariant}
              disabled={disabled}
              onClick={onRemove}
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-red-200 bg-white text-red-500 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
