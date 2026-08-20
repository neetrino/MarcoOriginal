import "server-only";

import { and, asc, desc, eq, inArray, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { getDb } from "@/db/client";
import { brands, categories, productCategories, products } from "@/db/schema";
import {
  readCompareProductIds,
  writeCompareProductIds,
} from "@/features/compare/cookie";
import {
  MAX_COMPARE_PRODUCTS,
  removeCompareProductId,
  toggleCompareProductId,
} from "@/features/compare/domain/compare-list";
import { matchBrandTitle } from "@/features/compare/domain/match-brand-title";
import type {
  ComparePageView,
  CompareProductColumn,
} from "@/features/compare/types";
import type { CatalogProduct } from "@/features/products/types";
import { getActiveProductsByIds } from "@/features/products/queries";
import type { Locale } from "@/lib/i18n/config";
import type { DisplayPrice } from "@/lib/money/display-price";

export type { ComparePageView, CompareProductColumn } from "@/features/compare/types";

/** Product IDs currently in the viewer's compare list. */
export async function getCompareProductIds(): Promise<Set<string>> {
  return new Set(await readCompareProductIds());
}

/** Returns compare item count for the header badge. */
export async function getCompareCount(): Promise<number> {
  return (await readCompareProductIds()).length;
}

async function assertActiveProduct(productId: string): Promise<void> {
  const [product] = await getDb()
    .select({
      id: products.id,
      status: products.status,
    })
    .from(products)
    .where(and(eq(products.id, productId), isNull(products.deletedAt)))
    .limit(1);

  if (!product || product.status !== "ACTIVE") {
    throw new Error("PRODUCT_UNAVAILABLE");
  }
}

/**
 * Adds or removes a product from the compare cookie.
 * Guests may compare without signing in.
 */
export async function toggleCompare(productId: string): Promise<{
  inCompare: boolean;
  count: number;
}> {
  await assertActiveProduct(productId);
  const current = await readCompareProductIds();
  const next = toggleCompareProductId(current, productId);
  if (next.status === "limit") {
    throw new Error("COMPARE_LIMIT");
  }

  await writeCompareProductIds(next.ids);
  revalidateComparePaths();
  return { inCompare: next.inCompare, count: next.ids.length };
}

/** Removes one product from the compare cookie. */
export async function removeCompare(productId: string): Promise<void> {
  const current = await readCompareProductIds();
  const next = removeCompareProductId(current, productId);
  await writeCompareProductIds(next);
  revalidateComparePaths();
}

function revalidateComparePaths(): void {
  revalidatePath("/", "layout");
}

type CategoryRef = {
  title: string;
};

async function loadPrimaryCategoryTitles(
  productIds: string[],
  locale: Locale,
): Promise<Map<string, CategoryRef>> {
  const map = new Map<string, CategoryRef>();
  if (productIds.length === 0) {
    return map;
  }

  const rows = await getDb()
    .select({
      productId: productCategories.productId,
      isPrimary: productCategories.isPrimary,
      sortOrder: productCategories.sortOrder,
      translations: categories.translations,
    })
    .from(productCategories)
    .innerJoin(categories, eq(productCategories.categoryId, categories.id))
    .where(
      and(
        inArray(productCategories.productId, productIds),
        eq(categories.status, "ACTIVE"),
        isNull(categories.deletedAt),
      ),
    )
    .orderBy(desc(productCategories.isPrimary), asc(productCategories.sortOrder));

  for (const row of rows) {
    if (map.has(row.productId)) {
      continue;
    }
    const translation = row.translations[locale] ?? row.translations.hy;
    if (!translation) {
      continue;
    }
    map.set(row.productId, { title: translation.title });
  }

  return map;
}

async function loadBrandTitles(locale: Locale): Promise<string[]> {
  const rows = await getDb()
    .select({ translations: brands.translations })
    .from(brands)
    .where(isNull(brands.deletedAt));

  const titles: string[] = [];
  for (const row of rows) {
    const translation = row.translations[locale] ?? row.translations.hy;
    if (translation?.title) {
      titles.push(translation.title);
    }
  }
  return titles;
}

function sharedCategoryTitle(
  productIds: readonly string[],
  categoriesByProduct: Map<string, CategoryRef>,
): string | null {
  const titles = productIds
    .map((id) => categoriesByProduct.get(id)?.title)
    .filter((title): title is string => Boolean(title));
  if (titles.length === 0) {
    return null;
  }
  const unique = new Set(titles);
  return unique.size === 1 ? (titles[0] ?? null) : null;
}

function toCompareColumn(
  product: CatalogProduct,
  locale: Locale,
  formatPrice: (baseAmountAmd: number) => DisplayPrice,
  brandTitles: readonly string[],
): CompareProductColumn {
  const price = formatPrice(product.priceAmount);
  const compareAt =
    product.compareAtAmount != null
      ? formatPrice(product.compareAtAmount)
      : null;

  return {
    id: product.id,
    href: `/${locale}/products/${product.translation.slug}`,
    title: product.translation.title,
    brand: matchBrandTitle(product.translation.title, brandTitles),
    imageUrl: product.imageUrl,
    priceFormatted: price.formatted,
    compareAtFormatted: compareAt?.formatted ?? null,
    inStock: product.stockOnHand > 0,
  };
}

/** Active catalog products in compare order, with display fields. */
export async function listComparePageView(
  locale: Locale,
  formatPrice: (baseAmountAmd: number) => DisplayPrice,
): Promise<ComparePageView> {
  const orderedIds = await readCompareProductIds();
  if (orderedIds.length === 0) {
    return {
      heading: null,
      products: [],
      count: 0,
      max: MAX_COMPARE_PRODUCTS,
    };
  }

  const [active, categoriesByProduct, brandTitles] = await Promise.all([
    getActiveProductsByIds(locale, orderedIds),
    loadPrimaryCategoryTitles(orderedIds, locale),
    loadBrandTitles(locale),
  ]);
  const byId = new Map(active.map((product) => [product.id, product]));
  const productsForView = orderedIds.flatMap((id) => {
    const product = byId.get(id);
    return product
      ? [toCompareColumn(product, locale, formatPrice, brandTitles)]
      : [];
  });

  return {
    heading: sharedCategoryTitle(
      productsForView.map((product) => product.id),
      categoriesByProduct,
    ),
    products: productsForView,
    count: productsForView.length,
    max: MAX_COMPARE_PRODUCTS,
  };
}
