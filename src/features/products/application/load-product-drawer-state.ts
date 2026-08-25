"use server";

import { and, eq, inArray, isNull } from "drizzle-orm";

import { getDb } from "@/db/client";
import { attributeValues, products } from "@/db/schema";
import {
  adminVariantsToDrafts,
  loadAdminProductVariants,
  selectedAttributeIdsFromVariants,
} from "@/features/products/application/load-product-variants";
import type { ProductVariantDraft } from "@/features/products/domain/product-variant-draft";
import { isProductType, type ProductType } from "@/features/products/domain/product-type";
import { requireAdmin } from "@/lib/auth/policies";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { err, ok, type Result } from "@/lib/result";

export type ProductDrawerVariantState = {
  productType: ProductType;
  selectedAttributeIds: string[];
  attributeValueIds: Record<string, string>;
  variants: ProductVariantDraft[];
};

async function mapValueIdsToAttributeMap(
  valueIds: string[],
): Promise<Record<string, string>> {
  if (valueIds.length === 0) return {};

  const rows = await getDb()
    .select({
      id: attributeValues.id,
      attributeId: attributeValues.attributeId,
    })
    .from(attributeValues)
    .where(inArray(attributeValues.id, valueIds));

  const map: Record<string, string> = {};
  for (const row of rows) {
    map[row.attributeId] = row.id;
  }
  return map;
}

/** Loads variable-product editor state for the admin drawer. */
export async function loadProductDrawerVariantStateAction(
  locale: string,
  productId: string,
): Promise<Result<ProductDrawerVariantState>> {
  if (!isLocale(locale)) {
    return err("INVALID_LOCALE", "Invalid locale.");
  }

  await requireAdmin(locale as Locale);

  const [product] = await getDb()
    .select({
      productType: products.productType,
      attributeValueIds: products.attributeValueIds,
    })
    .from(products)
    .where(and(eq(products.id, productId), isNull(products.deletedAt)))
    .limit(1);

  if (!product) {
    return err("NOT_FOUND", "Product not found.");
  }

  const adminVariants = await loadAdminProductVariants(productId);
  const productType = isProductType(product.productType)
    ? product.productType
    : adminVariants.length > 0
      ? "VARIABLE"
      : "SIMPLE";

  const simpleAttributeValueIds = await mapValueIdsToAttributeMap(
    product.attributeValueIds ?? [],
  );
  const variantAttributeIds = selectedAttributeIdsFromVariants(adminVariants);
  const selectedAttributeIds =
    productType === "SIMPLE"
      ? Object.keys(simpleAttributeValueIds)
      : variantAttributeIds;

  return ok({
    productType,
    selectedAttributeIds,
    attributeValueIds: simpleAttributeValueIds,
    variants: adminVariantsToDrafts(adminVariants),
  });
}
