import "server-only";

import { and, asc, desc, eq, inArray, isNull } from "drizzle-orm";

import { getDb } from "@/db/client";
import { brands, productBrands } from "@/db/schema";
import { loadBrandImageUrls } from "@/features/brands/application/load-brand-images";

/** Brand ids per product, in stored sort order. */
export async function loadProductBrandIds(
  productIds: readonly string[],
): Promise<Map<string, string[]>> {
  const map = new Map<string, string[]>();
  if (productIds.length === 0) return map;

  const rows = await getDb()
    .select({
      productId: productBrands.productId,
      brandId: productBrands.brandId,
    })
    .from(productBrands)
    .where(inArray(productBrands.productId, [...productIds]))
    .orderBy(asc(productBrands.sortOrder));

  for (const row of rows) {
    const ids = map.get(row.productId) ?? [];
    ids.push(row.brandId);
    map.set(row.productId, ids);
  }
  return map;
}

/** Primary brand logo URL for each product, keyed by product id. */
export async function loadProductBrandLogoUrls(
  productIds: readonly string[],
): Promise<Map<string, string>> {
  const logos = new Map<string, string>();
  if (productIds.length === 0) return logos;

  const links = await getDb()
    .select({
      productId: productBrands.productId,
      brandId: productBrands.brandId,
    })
    .from(productBrands)
    .innerJoin(brands, eq(productBrands.brandId, brands.id))
    .where(
      and(
        inArray(productBrands.productId, [...productIds]),
        isNull(brands.deletedAt),
      ),
    )
    .orderBy(desc(productBrands.isPrimary), asc(productBrands.sortOrder));

  const primaryBrandByProduct = new Map<string, string>();
  for (const link of links) {
    if (primaryBrandByProduct.has(link.productId)) continue;
    primaryBrandByProduct.set(link.productId, link.brandId);
  }

  const images = await loadBrandImageUrls([
    ...new Set(primaryBrandByProduct.values()),
  ]);
  for (const [productId, brandId] of primaryBrandByProduct) {
    const url = images.get(brandId);
    if (url) logos.set(productId, url);
  }

  return logos;
}
