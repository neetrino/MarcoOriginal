import "server-only";

import { and, asc, eq, inArray, isNull, sql } from "drizzle-orm";
import { unstable_cache } from "next/cache";

import { getDb } from "@/db/client";
import {
  attributes,
  attributeValues,
  brands,
  categories,
  productCategories,
  products,
  type LocaleTranslation,
} from "@/db/schema";
import {
  buildCategoryTree,
  type CategoryTreeNode,
} from "@/features/categories/domain/category-tree";
import type {
  CatalogAttributeFacet,
  CatalogBrandFacet,
  CatalogCategoryFacet,
  CatalogColorFacet,
  CatalogFacets,
} from "@/features/products/domain/catalog-filters";
import {
  CACHE_TAGS,
  PUBLIC_CACHE_REVALIDATE_SECONDS,
} from "@/lib/cache/tags";
import type { Locale } from "@/lib/i18n/config";

type CategoryRow = {
  id: string;
  parentId: string | null;
  title: string;
  slug: string;
};

const activeProductWhere = and(
  eq(products.status, "ACTIVE"),
  isNull(products.deletedAt),
);

function translationFor(
  translations: { hy?: LocaleTranslation; en?: LocaleTranslation; ru?: LocaleTranslation },
  locale: Locale,
): LocaleTranslation | null {
  return translations[locale] ?? translations.hy ?? translations.en ?? null;
}

function toCategoryFacet(
  node: CategoryTreeNode<CategoryRow>,
  countById: Map<string, number>,
): CatalogCategoryFacet {
  const children = node.children.map((child) =>
    toCategoryFacet(child, countById),
  );
  const direct = countById.get(node.id) ?? 0;
  const count = children.reduce((sum, child) => sum + child.count, direct);
  return {
    id: node.id,
    slug: node.slug,
    title: node.title,
    count,
    children,
  };
}

async function loadCategoryFacets(
  locale: Locale,
): Promise<CatalogCategoryFacet[]> {
  const rows = await getDb()
    .select({
      id: categories.id,
      parentId: categories.parentId,
      translations: categories.translations,
    })
    .from(categories)
    .where(and(eq(categories.status, "ACTIVE"), isNull(categories.deletedAt)))
    .orderBy(asc(categories.sortOrder), asc(categories.createdAt));

  const mapped: CategoryRow[] = [];
  for (const row of rows) {
    const translation = translationFor(row.translations, locale);
    if (!translation) continue;
    mapped.push({
      id: row.id,
      parentId: row.parentId,
      title: translation.title,
      slug: translation.slug,
    });
  }

  const countRows =
    mapped.length === 0
      ? []
      : await getDb()
          .select({
            categoryId: productCategories.categoryId,
            count: sql<number>`count(distinct ${productCategories.productId})::int`,
          })
          .from(productCategories)
          .innerJoin(products, eq(products.id, productCategories.productId))
          .where(
            and(
              activeProductWhere,
              inArray(
                productCategories.categoryId,
                mapped.map((row) => row.id),
              ),
            ),
          )
          .groupBy(productCategories.categoryId);

  const countById = new Map<string, number>();
  for (const row of countRows) {
    countById.set(row.categoryId, row.count);
  }

  return buildCategoryTree(mapped).map((node) =>
    toCategoryFacet(node, countById),
  );
}

async function loadBrandFacets(locale: Locale): Promise<CatalogBrandFacet[]> {
  const rows = await getDb()
    .select({
      id: brands.id,
      translations: brands.translations,
    })
    .from(brands)
    .where(isNull(brands.deletedAt))
    .orderBy(asc(brands.sortOrder), asc(brands.createdAt));

  const facets: CatalogBrandFacet[] = [];
  for (const row of rows) {
    const translation = translationFor(row.translations, locale);
    if (!translation) continue;
    facets.push({
      id: row.id,
      slug: translation.slug,
      title: translation.title,
    });
  }
  return facets;
}

async function loadAttributeFacets(
  locale: Locale,
): Promise<{ attributes: CatalogAttributeFacet[]; colors: CatalogColorFacet[] }> {
  const attributeRows = await getDb()
    .select({
      id: attributes.id,
      key: attributes.key,
      translations: attributes.translations,
    })
    .from(attributes)
    .where(isNull(attributes.deletedAt))
    .orderBy(asc(attributes.sortOrder), asc(attributes.createdAt));

  if (attributeRows.length === 0) {
    return { attributes: [], colors: [] };
  }

  const valueRows = await getDb()
    .select({
      id: attributeValues.id,
      attributeId: attributeValues.attributeId,
      translations: attributeValues.translations,
      colorHex: attributeValues.colorHex,
    })
    .from(attributeValues)
    .where(
      inArray(
        attributeValues.attributeId,
        attributeRows.map((row) => row.id),
      ),
    )
    .orderBy(asc(attributeValues.sortOrder), asc(attributeValues.createdAt));

  const valuesByAttribute = new Map<
    string,
    CatalogAttributeFacet["values"]
  >();
  for (const row of valueRows) {
    const translation = translationFor(row.translations, locale);
    if (!translation) continue;
    const list = valuesByAttribute.get(row.attributeId) ?? [];
    list.push({
      id: row.id,
      title: translation.title,
      colorHex: row.colorHex
        ? row.colorHex.replace(/^#/, "").toLowerCase()
        : null,
    });
    valuesByAttribute.set(row.attributeId, list);
  }

  const facets: CatalogAttributeFacet[] = [];
  const colors: CatalogColorFacet[] = [];
  const seenHex = new Set<string>();

  for (const row of attributeRows) {
    const translation = translationFor(row.translations, locale);
    if (!translation) continue;
    const values = valuesByAttribute.get(row.id) ?? [];
    if (values.length === 0) continue;
    facets.push({
      id: row.id,
      key: row.key,
      title: translation.title,
      values,
    });
    for (const value of values) {
      if (!value.colorHex || seenHex.has(value.colorHex)) continue;
      seenHex.add(value.colorHex);
      colors.push({ id: value.id, hex: value.colorHex });
    }
  }

  return { attributes: facets, colors };
}

async function loadPriceBounds(): Promise<{
  minPriceAmd: number | null;
  maxPriceAmd: number | null;
}> {
  const [row] = await getDb()
    .select({
      minPriceAmd: sql<number | null>`min(${products.priceAmount})::int`,
      maxPriceAmd: sql<number | null>`max(${products.priceAmount})::int`,
    })
    .from(products)
    .where(activeProductWhere);

  return {
    minPriceAmd: row?.minPriceAmd ?? null,
    maxPriceAmd: row?.maxPriceAmd ?? null,
  };
}

async function loadCatalogFacets(locale: Locale): Promise<CatalogFacets> {
  const [categoryTree, brandList, attributeFacets, price] = await Promise.all([
    loadCategoryFacets(locale),
    loadBrandFacets(locale),
    loadAttributeFacets(locale),
    loadPriceBounds(),
  ]);

  return {
    categories: categoryTree,
    brands: brandList,
    attributes: attributeFacets.attributes,
    colors: attributeFacets.colors,
    minPriceAmd: price.minPriceAmd,
    maxPriceAmd: price.maxPriceAmd,
  };
}

/** Storefront filter facets: categories, brands, colors, and AMD price bounds. */
export async function getCatalogFacets(locale: Locale): Promise<CatalogFacets> {
  return unstable_cache(
    async () => loadCatalogFacets(locale),
    ["catalog-facets", locale],
    {
      tags: [CACHE_TAGS.products, CACHE_TAGS.brands],
      revalidate: PUBLIC_CACHE_REVALIDATE_SECONDS,
    },
  )();
}
