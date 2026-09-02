import type { LocaleTranslation, TranslationsJson } from "@/db/schema";
import { locales, type Locale } from "@/lib/i18n/config";

export type CategoryLocaleDraft = {
  title: string;
  slug: string;
  drawerTitle: string;
};

export type CategoryLocaleDrafts = Record<Locale, CategoryLocaleDraft>;

function sharedSlugFromDrafts(drafts: CategoryLocaleDrafts): string {
  const enSlug = drafts.en.slug.trim();
  if (enSlug) return enSlug;
  for (const loc of locales) {
    const slug = drafts[loc].slug.trim();
    if (slug) return slug;
  }
  return "";
}

function translationPayload(
  title: string,
  slug: string,
  drawerTitle: string,
): LocaleTranslation {
  const trimmedDrawerTitle = drawerTitle.trim();
  if (!trimmedDrawerTitle) return { title, slug };
  return { title, slug, drawerTitle: trimmedDrawerTitle };
}

function filledDraft(
  drafts: CategoryLocaleDrafts,
): CategoryLocaleDraft | null {
  for (const loc of locales) {
    const title = drafts[loc].title.trim();
    if (!title) continue;
    return {
      title,
      slug: sharedSlugFromDrafts(drafts),
      drawerTitle: drafts[loc].drawerTitle.trim(),
    };
  }
  return null;
}

/** Locales that currently have a title. */
export function filledTranslationsFromDrafts(
  drafts: CategoryLocaleDrafts,
): TranslationsJson {
  const slug = sharedSlugFromDrafts(drafts);
  const translations: TranslationsJson = {};
  for (const loc of locales) {
    const title = drafts[loc].title.trim();
    if (!title) continue;
    translations[loc] = translationPayload(
      title,
      slug,
      drafts[loc].drawerTitle,
    );
  }
  return translations;
}

/** Builds persisted translations from locale drafts. Empty locales copy the first filled one. */
export function translationsFromDrafts(
  drafts: CategoryLocaleDrafts,
): TranslationsJson | null {
  const fallback = filledDraft(drafts);
  if (!fallback) return null;

  const slug = sharedSlugFromDrafts(drafts) || fallback.slug;
  const translations: TranslationsJson = {};
  for (const loc of locales) {
    const title = drafts[loc].title.trim();
    translations[loc] = title
      ? translationPayload(title, slug, drafts[loc].drawerTitle)
      : translationPayload(fallback.title, slug, fallback.drawerTitle);
  }
  return translations;
}

/** Updates only locales that have a title; keeps existing copy otherwise.
 *  Always syncs one shared slug onto every locale present in the result.
 */
export function mergeCategoryTranslations(
  existing: TranslationsJson,
  drafts: CategoryLocaleDrafts,
): TranslationsJson {
  const slug = sharedSlugFromDrafts(drafts);
  const translations: TranslationsJson = { ...existing };
  for (const loc of locales) {
    const title = drafts[loc].title.trim();
    if (!title) continue;
    const previous = translations[loc];
    translations[loc] = translationPayload(
      title,
      slug || drafts[loc].slug.trim(),
      drafts[loc].drawerTitle,
    );
    if (previous?.description) {
      translations[loc] = {
        ...translations[loc],
        description: previous.description,
      };
    }
  }
  if (!slug) return translations;
  for (const loc of locales) {
    const copy = translations[loc];
    if (!copy) continue;
    translations[loc] = { ...copy, slug };
  }
  return translations;
}
