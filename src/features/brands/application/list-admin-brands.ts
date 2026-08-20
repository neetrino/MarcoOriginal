import "server-only";

import { asc, isNull } from "drizzle-orm";

import { getDb } from "@/db/client";
import { brands, type LocaleTranslation } from "@/db/schema";
import { loadBrandImageUrls } from "@/features/brands/application/load-brand-images";
import type { Locale } from "@/lib/i18n/config";

export type AdminBrandListItem = {
  id: string;
  title: string;
  sku: string;
  imageUrl: string | null;
};

function translationFor(
  translations: (typeof brands.$inferSelect)["translations"],
  locale: Locale,
): LocaleTranslation | null {
  return translations[locale] ?? translations.hy ?? translations.en ?? null;
}

/** Lists non-deleted brands for the admin brands table. */
export async function listAdminBrands(
  locale: Locale,
): Promise<AdminBrandListItem[]> {
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
      sku: row.sku,
      imageUrl: images.get(row.id) ?? null,
    };
  });
}
