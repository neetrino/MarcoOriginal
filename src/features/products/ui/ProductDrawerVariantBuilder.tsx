"use client";

import { useState } from "react";

import { ADMIN_INPUT, ADMIN_LABEL } from "@/features/admin/ui/admin-form-classes";
import type { AdminAttributeListItem } from "@/features/attributes/domain/attribute-admin-model";
import {
  createDraftProductVariant,
  type ProductVariantDraft,
} from "@/features/products/domain/product-variant-draft";
import { ProductDrawerVariantRow } from "@/features/products/ui/ProductDrawerVariantRow";
import {
  VARIANT_ADD_BUTTON,
  VARIANT_OUTLINE_BUTTON,
  VARIANT_READY_BUTTON,
  VARIANT_SECTION_TITLE,
} from "@/features/products/ui/product-drawer-variant.classes";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

type EditorCopy = Dictionary["admin"]["productEditor"];

type BulkAction = "price" | "sku" | null;

type ProductDrawerVariantBuilderProps = {
  copy: EditorCopy;
  attributes: readonly AdminAttributeListItem[];
  variants: ProductVariantDraft[];
  disabled: boolean;
  onChange: (variants: ProductVariantDraft[]) => void;
};

export function ProductDrawerVariantBuilder({
  copy,
  attributes,
  variants,
  disabled,
  onChange,
}: ProductDrawerVariantBuilderProps) {
  const [bulkAction, setBulkAction] = useState<BulkAction>(null);
  const [bulkValue, setBulkValue] = useState("");

  function updateVariant(index: number, next: ProductVariantDraft): void {
    onChange(
      variants.map((variant, variantIndex) =>
        variantIndex === index ? next : variant,
      ),
    );
  }

  function removeVariant(index: number): void {
    onChange(variants.filter((_, variantIndex) => variantIndex !== index));
  }

  function openBulkAction(action: Exclude<BulkAction, null>): void {
    setBulkAction(action);
    setBulkValue("");
  }

  function closeBulkAction(): void {
    setBulkAction(null);
    setBulkValue("");
  }

  function confirmBulkAction(): void {
    const trimmed = bulkValue.trim();
    if (!trimmed || variants.length === 0) return;

    if (bulkAction === "price") {
      onChange(
        variants.map((variant) => ({ ...variant, priceAmount: trimmed })),
      );
    } else if (bulkAction === "sku") {
      onChange(
        variants.map((variant, index) => ({
          ...variant,
          sku: index === 0 ? trimmed : `${trimmed}-${index + 1}`,
        })),
      );
    }

    closeBulkAction();
  }

  return (
    <section className="flex flex-col gap-4">
      <h3 className={VARIANT_SECTION_TITLE}>{copy.variableBuilderTitle}</h3>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h4 className="text-sm font-semibold text-slate-800">
            {copy.variableGeneratedTitle.replace(
              "{count}",
              String(variants.length),
            )}
          </h4>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={disabled || variants.length === 0}
              onClick={() => openBulkAction("price")}
              className={VARIANT_OUTLINE_BUTTON}
            >
              {copy.variableApplyPriceAll}
            </button>
            <button
              type="button"
              disabled={disabled || variants.length === 0}
              onClick={() => openBulkAction("sku")}
              className={VARIANT_OUTLINE_BUTTON}
            >
              {copy.variableApplySkuAll}
            </button>
          </div>
        </div>

        {bulkAction ? (
          <div className="mb-4 rounded-xl border border-slate-200 bg-[#f6f7f9] p-4">
            <label className="block">
              <span className={ADMIN_LABEL}>
                {bulkAction === "price"
                  ? copy.variableBulkPriceLabel
                  : copy.variableBulkSkuLabel}
              </span>
              <input
                autoFocus
                type={bulkAction === "price" ? "number" : "text"}
                inputMode={bulkAction === "price" ? "numeric" : "text"}
                min={bulkAction === "price" ? 0 : undefined}
                step={bulkAction === "price" ? 1 : undefined}
                value={bulkValue}
                placeholder={
                  bulkAction === "price"
                    ? copy.variableBulkPricePlaceholder
                    : copy.skuPlaceholder
                }
                onChange={(event) => setBulkValue(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    confirmBulkAction();
                  }
                  if (event.key === "Escape") {
                    event.preventDefault();
                    closeBulkAction();
                  }
                }}
                className={`${ADMIN_INPUT} max-w-md rounded-lg`}
                disabled={disabled}
              />
            </label>
            {bulkAction === "sku" ? (
              <p className="mt-2 text-xs text-slate-400">
                {copy.variableBulkSkuHint}
              </p>
            ) : null}
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                disabled={disabled || !bulkValue.trim()}
                onClick={confirmBulkAction}
                className="rounded-lg bg-marco-slate px-5 py-2 text-sm font-medium text-white hover:brightness-95 disabled:opacity-50"
              >
                {copy.variableBulkApply}
              </button>
              <button
                type="button"
                disabled={disabled}
                onClick={closeBulkAction}
                className={VARIANT_OUTLINE_BUTTON}
              >
                {copy.cancel}
              </button>
            </div>
          </div>
        ) : null}

        {variants.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-200 bg-[#f6f7f9] px-4 py-8 text-center text-sm text-slate-400">
            {copy.variableEmptyHint}
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {variants.map((variant, index) => (
              <ProductDrawerVariantRow
                key={variant.key}
                copy={copy}
                variant={variant}
                attributes={attributes}
                disabled={disabled}
                onChange={(next) => updateVariant(index, next)}
                onRemove={() => removeVariant(index)}
              />
            ))}
          </div>
        )}

        <div className="mt-4 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            disabled={disabled || attributes.length === 0}
            onClick={() => onChange([...variants, createDraftProductVariant()])}
            className={VARIANT_ADD_BUTTON}
          >
            {copy.variableAddVariant}
          </button>
          <button
            type="button"
            disabled={disabled || variants.length === 0}
            onClick={closeBulkAction}
            className={VARIANT_READY_BUTTON}
          >
            {copy.variableVariantsReady}
          </button>
        </div>
      </div>
    </section>
  );
}
