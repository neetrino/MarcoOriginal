import { createId } from "@/lib/id";

import type { VariantDiscountType } from "@/features/products/domain/variant-discount";

export type ProductVariantDraftImage = {
  key: string;
  previewUrl: string;
  existingId?: string;
  file?: File;
};

export type ProductVariantDraft = {
  key: string;
  id?: string;
  sku: string;
  priceAmount: string;
  discountType: VariantDiscountType;
  discountValue: string;
  discountStartsAt: string;
  discountEndsAt: string;
  attributeValueIds: Record<string, string>;
  image: ProductVariantDraftImage | null;
  removeImageId: string | null;
};

export function createDraftProductVariant(): ProductVariantDraft {
  return {
    key: createId(),
    sku: "",
    priceAmount: "",
    discountType: "PERCENTAGE",
    discountValue: "",
    discountStartsAt: "",
    discountEndsAt: "",
    attributeValueIds: {},
    image: null,
    removeImageId: null,
  };
}

export function variantAttributeSignature(
  attributeValueIds: Record<string, string>,
): string {
  return Object.entries(attributeValueIds)
    .filter(([, valueId]) => valueId)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([attributeId, valueId]) => `${attributeId}:${valueId}`)
    .join("|");
}
