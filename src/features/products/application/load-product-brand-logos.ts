import "server-only";

import { and, asc, desc, eq, inArray, isNull } from "drizzle-orm";

import { getDb } from "@/db/client";
import { brands, productBrands, type TranslationsJson } from "@/db/schema";
import { loadBrandImageUrls } from "@/features/brands/application/load-brand-images";
import type { Locale } from "@/lib/i18n/config";

export type ProductBrandMark = {
  name: string | null;
  logoUrl: string | null;
};

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

function brandTitleForLocale(
  translations: TranslationsJson,
  locale: Locale,
): string | null {
  return (
    translations[locale]?.title ??
    translations.hy?.title ??
    translations.en?.title ??
    translations.ru?.title ??
    null
  );
}

/** Primary brand name and logo URL for each product, keyed by product id. */
export async function loadProductBrandMarks(
  productIds: readonly string[],
  locale: Locale,
): Promise<Map<string, ProductBrandMark>> {
  const marks = new Map<string, ProductBrandMark>();
  if (productIds.length === 0) return marks;

  const links = await getDb()
    .select({
      productId: productBrands.productId,
      brandId: productBrands.brandId,
      translations: brands.translations,
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
  const titles = new Map<string, string | null>();
  for (const link of links) {
    if (primaryBrandByProduct.has(link.productId)) continue;
    primaryBrandByProduct.set(link.productId, link.brandId);
    if (!titles.has(link.brandId)) {
      titles.set(link.brandId, brandTitleForLocale(link.translations, locale));
    }
  }

  const images = await loadBrandImageUrls([
    ...new Set(primaryBrandByProduct.values()),
  ]);
  for (const [productId, brandId] of primaryBrandByProduct) {
    marks.set(productId, {
      name: titles.get(brandId) ?? null,
      logoUrl: images.get(brandId) ?? null,
    });
  }

  return marks;
}
