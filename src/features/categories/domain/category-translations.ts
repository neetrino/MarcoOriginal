import type { TranslationsJson } from "@/db/schema";
import { locales, type Locale } from "@/lib/i18n/config";

export type CategoryLocaleDraft = {
  title: string;
  slug: string;
};

export type CategoryLocaleDrafts = Record<Locale, CategoryLocaleDraft>;

function filledDraft(
  drafts: CategoryLocaleDrafts,
): CategoryLocaleDraft | null {
  for (const loc of locales) {
    const title = drafts[loc].title.trim();
    if (!title) continue;
    const slug = drafts[loc].slug.trim();
    return { title, slug };
  }
  return null;
}

/** Locales that currently have a title. */
export function filledTranslationsFromDrafts(
  drafts: CategoryLocaleDrafts,
): TranslationsJson {
  const translations: TranslationsJson = {};
  for (const loc of locales) {
    const title = drafts[loc].title.trim();
    if (!title) continue;
    translations[loc] = {
      title,
      slug: drafts[loc].slug.trim(),
    };
  }
  return translations;
}

/** Builds persisted translations from locale drafts. Empty locales copy the first filled one. */
export function translationsFromDrafts(
  drafts: CategoryLocaleDrafts,
): TranslationsJson | null {
  const fallback = filledDraft(drafts);
  if (!fallback) return null;

  const translations: TranslationsJson = {};
  for (const loc of locales) {
    const title = drafts[loc].title.trim();
    translations[loc] = title
      ? { title, slug: drafts[loc].slug.trim() || fallback.slug }
      : fallback;
  }
  return translations;
}

/** Updates only locales that have a title; keeps existing copy otherwise. */
export function mergeCategoryTranslations(
  existing: TranslationsJson,
  drafts: CategoryLocaleDrafts,
): TranslationsJson {
  const translations: TranslationsJson = { ...existing };
  for (const loc of locales) {
    const title = drafts[loc].title.trim();
    if (!title) continue;
    translations[loc] = {
      title,
      slug: drafts[loc].slug.trim(),
    };
  }
  return translations;
}
