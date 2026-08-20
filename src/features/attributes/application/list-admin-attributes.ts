import "server-only";

import { asc, inArray, isNull } from "drizzle-orm";

import { getDb } from "@/db/client";
import {
  attributes,
  attributeValues,
  type LocaleTranslation,
} from "@/db/schema";
import { loadAttributeValueImageUrls } from "@/features/attributes/application/load-attribute-value-images";
import type {
  AdminAttributeListItem,
  AdminAttributeValue,
} from "@/features/attributes/domain/attribute-admin-model";
import type { Locale } from "@/lib/i18n/config";

function translationFor(
  translations: (typeof attributes.$inferSelect)["translations"],
  locale: Locale,
): LocaleTranslation | null {
  return translations[locale] ?? translations.hy ?? translations.en ?? null;
}

function toAdminValue(
  row: typeof attributeValues.$inferSelect,
  imageUrl: string | undefined,
  locale: Locale,
): AdminAttributeValue {
  const translation = translationFor(row.translations, locale);
  return {
    id: row.id,
    title: translation?.title || row.colorHex || "Untitled",
    colorHex: row.colorHex,
    imageUrl: imageUrl ?? null,
  };
}

/** Lists non-deleted attributes with named values for admin. */
export async function listAdminAttributes(
  locale: Locale,
): Promise<AdminAttributeListItem[]> {
  const rows = await getDb()
    .select()
    .from(attributes)
    .where(isNull(attributes.deletedAt))
    .orderBy(asc(attributes.sortOrder), asc(attributes.createdAt));

  if (rows.length === 0) return [];

  const valueRows = await getDb()
    .select()
    .from(attributeValues)
    .where(
      inArray(
        attributeValues.attributeId,
        rows.map((row) => row.id),
      ),
    )
    .orderBy(asc(attributeValues.sortOrder), asc(attributeValues.createdAt));

  const images = await loadAttributeValueImageUrls(
    valueRows.map((row) => row.id),
  );

  const valuesByAttribute = new Map<string, AdminAttributeValue[]>();
  for (const value of valueRows) {
    const list = valuesByAttribute.get(value.attributeId) ?? [];
    list.push(toAdminValue(value, images.get(value.id), locale));
    valuesByAttribute.set(value.attributeId, list);
  }

  return rows.map((row) => {
    const translation = translationFor(row.translations, locale);
    return {
      id: row.id,
      title: translation?.title ?? "Untitled",
      key: row.key,
      values: valuesByAttribute.get(row.id) ?? [],
    };
  });
}
