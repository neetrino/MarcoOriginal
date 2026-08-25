"use client";

import type { AdminAttributeListItem } from "@/features/attributes/domain/attribute-admin-model";
import {
  VARIABLE_PRODUCT_TYPE_DISABLED,
  type ProductType,
} from "@/features/products/domain/product-type";
import type { ProductVariantDraft } from "@/features/products/domain/product-variant-draft";
import { ProductDrawerAttributePicker } from "@/features/products/ui/ProductDrawerAttributePicker";
import { ProductDrawerPriceTypeToggle } from "@/features/products/ui/ProductDrawerPriceTypeToggle";
import { ProductDrawerSimpleAttributeValues } from "@/features/products/ui/ProductDrawerSimpleAttributeValues";
import { ProductDrawerSimplePriceFields } from "@/features/products/ui/ProductDrawerSimplePriceFields";
import { ProductDrawerVariantBuilder } from "@/features/products/ui/ProductDrawerVariantBuilder";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

type EditorCopy = Dictionary["admin"]["productEditor"];

type ProductDrawerPriceTabProps = {
  copy: EditorCopy;
  productType: ProductType;
  attributes: readonly AdminAttributeListItem[];
  selectedAttributeIds: string[];
  attributeValueIds: Record<string, string>;
  variants: ProductVariantDraft[];
  priceAmount: string;
  discountPercent: string;
  sku: string;
  disabled: boolean;
  onProductTypeChange: (value: ProductType) => void;
  onSelectedAttributeIdsChange: (ids: string[]) => void;
  onAttributeValueIdsChange: (valueIds: Record<string, string>) => void;
  onVariantsChange: (variants: ProductVariantDraft[]) => void;
  onPriceAmountChange: (value: string) => void;
  onDiscountPercentChange: (value: string) => void;
  onSkuChange: (value: string) => void;
};

export function ProductDrawerPriceTab({
  copy,
  productType,
  attributes,
  selectedAttributeIds,
  attributeValueIds,
  variants,
  priceAmount,
  discountPercent,
  sku,
  disabled,
  onProductTypeChange,
  onSelectedAttributeIdsChange,
  onAttributeValueIdsChange,
  onVariantsChange,
  onPriceAmountChange,
  onDiscountPercentChange,
  onSkuChange,
}: ProductDrawerPriceTabProps) {
  const selectedAttributes = attributes.filter((attribute) =>
    selectedAttributeIds.includes(attribute.id),
  );

  return (
    <section className="flex flex-col gap-6">
      <ProductDrawerPriceTypeToggle
        value={productType}
        typeLabel={copy.productTypeTitle}
        simpleLabel={copy.productTypeSimple}
        variableLabel={copy.productTypeVariable}
        disabled={disabled}
        variableDisabled={VARIABLE_PRODUCT_TYPE_DISABLED}
        onChange={onProductTypeChange}
      />

      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        {productType === "SIMPLE" ? (
          <>
            <ProductDrawerAttributePicker
              copy={copy}
              attributes={attributes}
              selectedIds={selectedAttributeIds}
              disabled={disabled}
              onChange={onSelectedAttributeIdsChange}
            />
            <ProductDrawerSimpleAttributeValues
              copy={copy}
              attributes={selectedAttributes}
              attributeValueIds={attributeValueIds}
              disabled={disabled}
              onChange={onAttributeValueIdsChange}
            />
            <div className="mt-6 border-t border-slate-100 pt-6">
              <h3 className="mb-5 text-xs font-semibold tracking-wide text-slate-400 uppercase">
                {copy.priceSectionTitle}
              </h3>
              <ProductDrawerSimplePriceFields
                copy={copy}
                priceAmount={priceAmount}
                discountPercent={discountPercent}
                sku={sku}
                disabled={disabled}
                onPriceAmountChange={onPriceAmountChange}
                onDiscountPercentChange={onDiscountPercentChange}
                onSkuChange={onSkuChange}
              />
            </div>
          </>
        ) : (
          <>
            <h3 className="mb-5 text-xs font-semibold tracking-wide text-slate-400 uppercase">
              {copy.priceSectionTitle}
            </h3>
            <ProductDrawerAttributePicker
              copy={copy}
              attributes={attributes}
              selectedIds={selectedAttributeIds}
              disabled={disabled}
              onChange={onSelectedAttributeIdsChange}
            />
          </>
        )}
      </div>

      {productType === "VARIABLE" && selectedAttributes.length > 0 ? (
        <ProductDrawerVariantBuilder
          copy={copy}
          attributes={selectedAttributes}
          variants={variants}
          disabled={disabled}
          onChange={onVariantsChange}
        />
      ) : null}
    </section>
  );
}
