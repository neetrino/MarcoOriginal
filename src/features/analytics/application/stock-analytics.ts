import "server-only";

import { and, asc, count, desc, eq, gt, inArray, isNull, lt } from "drizzle-orm";

import { getDb } from "@/db/client";
import { mediaAssets, products, type TranslationsJson } from "@/db/schema";
import {
  ANALYTICS_LOW_STOCK_THRESHOLD,
  ANALYTICS_STOCK_LIST_LIMIT,
} from "@/features/analytics/domain/analytics-display";
import type { Locale } from "@/lib/i18n/config";
import { mediaPublicUrl } from "@/lib/media/public-url";

export type AnalyticsStockRow = {
  productId: string;
  title: string;
  sku: string;
  stockOnHand: number;
  imageUrl: string | null;
};

export type AnalyticsStockList = {
  total: number;
  items: AnalyticsStockRow[];
};

export type AnalyticsStockBlock = {
  lowStockThreshold: number;
  outOfStock: AnalyticsStockList;
  lowStock: AnalyticsStockList;
};

function productTitle(translations: TranslationsJson, locale: Locale): string {
  return (
    translations[locale]?.title ??
    translations.hy?.title ??
    translations.en?.title ??
    translations.ru?.title ??
    "Untitled product"
  );
}

function stockWhere(kind: "out" | "low") {
  const stockFilter =
    kind === "out"
      ? eq(products.stockOnHand, 0)
      : and(
          gt(products.stockOnHand, 0),
          lt(products.stockOnHand, ANALYTICS_LOW_STOCK_THRESHOLD),
        );

  return and(
    eq(products.status, "ACTIVE"),
    isNull(products.deletedAt),
    stockFilter,
  );
}

async function loadImages(productIds: string[]): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  if (productIds.length === 0) return map;

  const rows = await getDb()
    .select({
      productId: mediaAssets.productId,
      objectKey: mediaAssets.objectKey,
    })
    .from(mediaAssets)
    .where(
      and(
        inArray(mediaAssets.productId, productIds),
        eq(mediaAssets.uploadStatus, "READY"),
      ),
    )
    .orderBy(asc(mediaAssets.sortOrder));

  for (const row of rows) {
    if (!row.productId || map.has(row.productId)) continue;
    map.set(row.productId, mediaPublicUrl(row.objectKey));
  }
  return map;
}

async function queryStockList(
  locale: Locale,
  kind: "out" | "low",
): Promise<AnalyticsStockList> {
  const where = stockWhere(kind);
  const orderBy =
    kind === "out"
      ? [desc(products.updatedAt)]
      : [asc(products.stockOnHand), desc(products.updatedAt)];

  const [[totalRow], rows] = await Promise.all([
    getDb().select({ value: count() }).from(products).where(where),
    getDb()
      .select({
        id: products.id,
        sku: products.sku,
        translations: products.translations,
        stockOnHand: products.stockOnHand,
      })
      .from(products)
      .where(where)
      .orderBy(...orderBy)
      .limit(ANALYTICS_STOCK_LIST_LIMIT),
  ]);

  const images = await loadImages(rows.map((row) => row.id));
  return {
    total: totalRow?.value ?? 0,
    items: rows.map((row) => ({
      productId: row.id,
      title: productTitle(row.translations, locale),
      sku: row.sku,
      stockOnHand: row.stockOnHand,
      imageUrl: images.get(row.id) ?? null,
    })),
  };
}

/** Published products that are out of stock or below the low-stock threshold. */
export async function getStockAnalytics(
  locale: Locale,
): Promise<AnalyticsStockBlock> {
  const [outOfStock, lowStock] = await Promise.all([
    queryStockList(locale, "out"),
    queryStockList(locale, "low"),
  ]);

  return {
    lowStockThreshold: ANALYTICS_LOW_STOCK_THRESHOLD,
    outOfStock,
    lowStock,
  };
}
