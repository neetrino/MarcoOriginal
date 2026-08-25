import "server-only";

import { asc, eq, inArray } from "drizzle-orm";

import { getDb } from "@/db/client";
import {
  attributeValues,
  mediaAssets,
  productVariantAttributeValues,
  productVariants,
} from "@/db/schema";
import { variantDiscountFromStored } from "@/features/products/domain/variant-discount";
import type { ProductVariantDraft } from "@/features/products/domain/product-variant-draft";
import { mediaPublicUrl } from "@/lib/media/public-url";

export type AdminProductVariant = {
  id: string;
  sku: string;
  priceAmount: number;
  compareAtAmount: number | null;
  discountType: "PERCENTAGE" | "FIXED" | null;
  discountValue: number | null;
  discountStartsAt: Date | null;
  discountEndsAt: Date | null;
  attributeValueIds: Record<string, string>;
  image: { id: string; url: string } | null;
};

function toDateTimeLocal(value: Date | null): string {
  if (!value) return "";
  return value.toISOString().slice(0, 16);
}

function toDraftVariant(variant: AdminProductVariant): ProductVariantDraft {
  const discount = variantDiscountFromStored(
    variant.priceAmount,
    variant.compareAtAmount,
    variant.discountType,
    variant.discountValue,
  );

  return {
    key: variant.id,
    id: variant.id,
    sku: variant.sku,
    priceAmount: String(variant.priceAmount),
    discountType: discount.discountType,
    discountValue: discount.discountValue,
    discountStartsAt: toDateTimeLocal(variant.discountStartsAt),
    discountEndsAt: toDateTimeLocal(variant.discountEndsAt),
    attributeValueIds: variant.attributeValueIds,
    image: variant.image
      ? {
          key: variant.image.id,
          previewUrl: variant.image.url,
          existingId: variant.image.id,
        }
      : null,
    removeImageId: null,
  };
}

/** Loads admin-editable variants for one product. */
export async function loadAdminProductVariants(
  productId: string,
): Promise<AdminProductVariant[]> {
  const rows = await getDb()
    .select()
    .from(productVariants)
    .where(eq(productVariants.productId, productId))
    .orderBy(asc(productVariants.sortOrder), asc(productVariants.createdAt));

  if (rows.length === 0) return [];

  const variantIds = rows.map((row) => row.id);
  const [valueRows, imageRows] = await Promise.all([
    getDb()
      .select({
        variantId: productVariantAttributeValues.variantId,
        attributeValueId: productVariantAttributeValues.attributeValueId,
        attributeId: attributeValues.attributeId,
      })
      .from(productVariantAttributeValues)
      .innerJoin(
        attributeValues,
        eq(attributeValues.id, productVariantAttributeValues.attributeValueId),
      )
      .where(inArray(productVariantAttributeValues.variantId, variantIds)),
    getDb()
      .select({
        id: mediaAssets.id,
        variantId: mediaAssets.productVariantId,
        objectKey: mediaAssets.objectKey,
      })
      .from(mediaAssets)
      .where(inArray(mediaAssets.productVariantId, variantIds)),
  ]);

  const valuesByVariant = new Map<string, Record<string, string>>();
  for (const row of valueRows) {
    const map = valuesByVariant.get(row.variantId) ?? {};
    map[row.attributeId] = row.attributeValueId;
    valuesByVariant.set(row.variantId, map);
  }

  const imageByVariant = new Map<string, { id: string; url: string }>();
  for (const row of imageRows) {
    if (!row.variantId) continue;
    imageByVariant.set(row.variantId, {
      id: row.id,
      url: mediaPublicUrl(row.objectKey),
    });
  }

  return rows.map((row) => ({
    id: row.id,
    sku: row.sku,
    priceAmount: row.priceAmount,
    compareAtAmount: row.compareAtAmount,
    discountType: row.discountType,
    discountValue: row.discountValue,
    discountStartsAt: row.discountStartsAt,
    discountEndsAt: row.discountEndsAt,
    attributeValueIds: valuesByVariant.get(row.id) ?? {},
    image: imageByVariant.get(row.id) ?? null,
  }));
}

export function adminVariantsToDrafts(
  variants: AdminProductVariant[],
): ProductVariantDraft[] {
  return variants.map(toDraftVariant);
}

export function selectedAttributeIdsFromVariants(
  variants: AdminProductVariant[],
): string[] {
  const ids = new Set<string>();
  for (const variant of variants) {
    for (const attributeId of Object.keys(variant.attributeValueIds)) {
      ids.add(attributeId);
    }
  }
  return [...ids];
}
