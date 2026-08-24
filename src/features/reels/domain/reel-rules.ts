import type { Locale } from "@/lib/i18n/config";

export type ReelLocaleCopy = {
  title: string;
};

export type ReelTranslations = Partial<Record<Locale, ReelLocaleCopy>>;

export const UNTITLED_REEL_TITLE = "Untitled";

/** Media fragment so browsers paint an opening frame on poster-less reel videos. */
export const REEL_VIDEO_FRAME_FRAGMENT = "#t=0.1" as const;

/** Thumbnail `src` for a reel video — seeks past a blank first frame. */
export function reelThumbnailSrc(videoUrl: string): string {
  if (videoUrl.includes("#")) return videoUrl;
  return `${videoUrl}${REEL_VIDEO_FRAME_FRAGMENT}`;
}

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
