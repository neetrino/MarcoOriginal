import "server-only";

import { and, asc, eq, inArray, isNotNull, isNull, or, sql } from "drizzle-orm";
import { unstable_cache } from "next/cache";

import { getDb } from "@/db/client";
import {
  categories,
  mediaAssets,
  productCategories,
  products,
  type LocaleTranslation,
} from "@/db/schema";
import {
  buildCategoryTree,
  type CategoryTreeNode,
} from "@/features/categories/domain/category-tree";
import type { HeaderCategoryNode } from "@/features/categories/domain/header-category-menu";
import {
  CACHE_TAGS,
  PUBLIC_CACHE_REVALIDATE_SECONDS,
} from "@/lib/cache/tags";
import type { Locale } from "@/lib/i18n/config";
import { mediaPublicUrl } from "@/lib/media/public-url";

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

function toMenuNode(
  node: CategoryTreeNode<CategoryRow>,
  countById: Map<string, number>,
  images: Map<string, string>,
  banners: Map<string, string>,
): HeaderCategoryNode {
  const children = node.children.map((child) =>
    toMenuNode(child, countById, images, banners),
  );
  const direct = countById.get(node.id) ?? 0;
  const count = children.reduce((sum, child) => sum + child.count, direct);
  return {
    id: node.id,
    slug: node.slug,
    title: node.title,
    count,
    imageUrl: images.get(node.id) ?? null,
    bannerImageUrl: banners.get(node.id) ?? null,
    children,
  };
}

async function loadCategoryImages(
  categoryIds: readonly string[],
): Promise<{ images: Map<string, string>; banners: Map<string, string> }> {
  const images = new Map<string, string>();
  const banners = new Map<string, string>();
  if (categoryIds.length === 0) return { images, banners };

  const mediaRows = await getDb()
    .select({
      categoryId: mediaAssets.categoryId,
      objectKey: mediaAssets.objectKey,
      role: mediaAssets.role,
      isPrimary: mediaAssets.isPrimary,
    })
    .from(mediaAssets)
    .where(
      and(
        isNotNull(mediaAssets.categoryId),
        inArray(mediaAssets.categoryId, [...categoryIds]),
        eq(mediaAssets.uploadStatus, "READY"),
        or(
          eq(mediaAssets.isPrimary, true),
          eq(mediaAssets.role, "PRIMARY"),
          eq(mediaAssets.role, "COVER"),
        ),
      ),
    );

  for (const media of mediaRows) {
    if (!media.categoryId) continue;
    const url = mediaPublicUrl(media.objectKey);
    if (media.role === "COVER") {
      if (!banners.has(media.categoryId)) banners.set(media.categoryId, url);
      continue;
    }
    if (!images.has(media.categoryId)) images.set(media.categoryId, url);
  }
  return { images, banners };
}

async function loadHeaderCategoryMenu(
  locale: Locale,
): Promise<HeaderCategoryNode[]> {
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

  const ids = mapped.map((row) => row.id);
  const [countRows, media] = await Promise.all([
    ids.length === 0
      ? Promise.resolve([])
      : getDb()
          .select({
            categoryId: productCategories.categoryId,
            count: sql<number>`count(distinct ${productCategories.productId})::int`,
          })
          .from(productCategories)
          .innerJoin(products, eq(products.id, productCategories.productId))
          .where(and(activeProductWhere, inArray(productCategories.categoryId, ids)))
          .groupBy(productCategories.categoryId),
    loadCategoryImages(ids),
  ]);

  const countById = new Map<string, number>();
  for (const row of countRows) {
    countById.set(row.categoryId, row.count);
  }

  return buildCategoryTree(mapped).map((node) =>
    toMenuNode(node, countById, media.images, media.banners),
  );
}

/** Published category tree for the header mega menu. */
export async function getHeaderCategoryMenu(
  locale: Locale,
): Promise<HeaderCategoryNode[]> {
  return unstable_cache(
    async () => loadHeaderCategoryMenu(locale),
    ["header-category-menu", locale],
    {
      tags: [CACHE_TAGS.products],
      revalidate: PUBLIC_CACHE_REVALIDATE_SECONDS,
    },
  )();
}
