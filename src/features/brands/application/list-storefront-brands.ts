import "server-only";

import { asc, isNull } from "drizzle-orm";
import { unstable_cache } from "next/cache";

import { getDb } from "@/db/client";
import { brands, type LocaleTranslation } from "@/db/schema";
import { loadBrandImageUrls } from "@/features/brands/application/load-brand-images";
import type { StorefrontBrandListItem } from "@/features/brands/types";
import {
  CACHE_TAGS,
  PUBLIC_CACHE_REVALIDATE_SECONDS,
} from "@/lib/cache/tags";
import type { Locale } from "@/lib/i18n/config";

export type { StorefrontBrandListItem };

function translationFor(
  translations: (typeof brands.$inferSelect)["translations"],
  locale: Locale,
): LocaleTranslation | null {
  return translations[locale] ?? translations.hy ?? translations.en ?? null;
}

async function loadStorefrontBrands(
  locale: Locale,
): Promise<StorefrontBrandListItem[]> {
  const rows = await getDb()
    .select()
    .from(brands)
    .where(isNull(brands.deletedAt))
    .orderBy(asc(brands.sortOrder), asc(brands.createdAt));

  const images = await loadBrandImageUrls(rows.map((row) => row.id));

  return rows.map((row) => {
    const translation = translationFor(row.translations, locale);
    return {
      id: row.id,
      title: translation?.title ?? "Untitled",
      slug: translation?.slug ?? "",
      imageUrl: images.get(row.id) ?? null,
    };
  });
}

/** Active brands visible on the storefront directory. */
export async function listStorefrontBrands(
  locale: Locale,
): Promise<StorefrontBrandListItem[]> {
  return unstable_cache(
    async () => loadStorefrontBrands(locale),
    ["storefront-brands", locale],
    {
      tags: [CACHE_TAGS.brands],
      revalidate: PUBLIC_CACHE_REVALIDATE_SECONDS,
    },
  )();
}
