import type { TranslationsJson } from "@/db/schema";

import { generateAttributeKey } from "@/features/attributes/domain/attribute-key";

/** Copies one title/slug into all catalog locales. */
export function buildAttributeTranslations(
  title: string,
  slug = generateAttributeKey(title),
): TranslationsJson {
  const translation = { title, slug };
  return { hy: translation, en: translation, ru: translation };
}
