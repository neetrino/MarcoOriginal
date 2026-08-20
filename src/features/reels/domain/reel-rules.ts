import type { Locale } from "@/lib/i18n/config";

export type ReelLocaleCopy = {
  title: string;
};

export type ReelTranslations = Partial<Record<Locale, ReelLocaleCopy>>;

export const UNTITLED_REEL_TITLE = "Untitled";

/** Picks the best available reel title for a locale with fallbacks. */
export function resolveReelTranslation(
  translations: ReelTranslations,
  locale: Locale,
): ReelLocaleCopy {
  const copy =
    translations[locale] ??
    translations.en ??
    translations.hy ??
    translations.ru ??
    null;

  return {
    title: copy?.title.trim() ?? "",
  };
}

/** Display title with an Untitled fallback when copy is empty. */
export function reelDisplayTitle(
  translations: ReelTranslations,
  locale: Locale,
  untitledLabel = UNTITLED_REEL_TITLE,
): string {
  const title = resolveReelTranslation(translations, locale).title;
  return title || untitledLabel;
}

/** Short public-facing reel id used in admin lists. */
export function shortReelId(id: string): string {
  return `reel-${id.replaceAll("-", "").slice(-6)}`;
}
