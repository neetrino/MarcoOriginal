export const HEADER_CATEGORY_PROMO_KEYS = [
  "furniture",
  "hardware",
  "generic",
] as const;

export type HeaderCategoryPromoKey = (typeof HEADER_CATEGORY_PROMO_KEYS)[number];

/** Static promo visuals for known furniture/hardware roots. */
export const HEADER_CATEGORY_PROMO_IMAGES: Record<
  Exclude<HeaderCategoryPromoKey, "generic">,
  string
> = {
  furniture: "/assets/header-category/promo-furniture.webp",
  hardware: "/assets/header-category/promo-hardware.webp",
};

export type HeaderCategoryPromoCopy = {
  badge: string;
  cta: string;
  furnitureHeadline: string;
  furnitureSubline: string;
  hardwareHeadline: string;
  hardwareSubline: string;
  genericHeadline: string;
  genericSubline: string;
};

export type HeaderCategoryPromoText = {
  badge: string;
  cta: string;
  headline: string;
  subline: string;
};

const HARDWARE_SLUG_ALIASES = [
  "kahovyqi-patrastman-paraganer",
  "kahovyqi-patrastman-paraganer-3",
  "furniture-hardware",
  "furniture-making",
  "furniture-accessories",
  "mebelnaya-furnitura",
  "կահույքի-պատրաստման-պարագաներ",
  "կահույքի-պատրաստման-համար-պարականեր",
] as const;

const FURNITURE_SLUG_ALIASES = [
  "kahovyq",
  "kahuyq",
  "furniture",
  "mebel",
  "կահույք",
] as const;

const HARDWARE_TITLE_ALIASES = [
  "կահույքի պատրաստման",
  "furniture hardware",
  "furniture-making",
  "мебельная фурнитура",
  "фурнитур",
] as const;

const FURNITURE_TITLE_ALIASES = [
  "կահույք",
  "furniture",
  "мебель",
] as const;

function matchesSlugAlias(
  slug: string,
  aliases: readonly string[],
): boolean {
  return aliases.some(
    (alias) => slug === alias || slug.startsWith(`${alias}-`),
  );
}

function matchesTitleAlias(
  title: string,
  aliases: readonly string[],
): boolean {
  return aliases.some(
    (alias) => title === alias || title.includes(alias),
  );
}

/**
 * Maps any root category to a promo card variant.
 * Slug aliases first, then localized title — so a junk/local slug still
 * keeps furniture/hardware fallbacks, and every other root stays generic.
 */
export function resolveHeaderCategoryPromo(
  slug: string,
  title = "",
): HeaderCategoryPromoKey {
  const normalizedSlug = slug.trim().toLowerCase();
  const normalizedTitle = title.trim().toLowerCase();
  if (
    matchesSlugAlias(normalizedSlug, HARDWARE_SLUG_ALIASES) ||
    matchesTitleAlias(normalizedTitle, HARDWARE_TITLE_ALIASES)
  ) {
    return "hardware";
  }
  if (
    matchesSlugAlias(normalizedSlug, FURNITURE_SLUG_ALIASES) ||
    matchesTitleAlias(normalizedTitle, FURNITURE_TITLE_ALIASES)
  ) {
    return "furniture";
  }
  return "generic";
}

/** Resolves the promo image: admin upload first, then a known static fallback. */
export function headerCategoryPromoImageUrl(
  key: HeaderCategoryPromoKey,
  uploadedUrl?: string | null,
): string | null {
  if (uploadedUrl && uploadedUrl.trim() !== "") return uploadedUrl;
  if (key === "generic") return null;
  return HEADER_CATEGORY_PROMO_IMAGES[key];
}

/** Picks localized headline/subline for the resolved promo card. */
export function headerCategoryPromoText(
  key: HeaderCategoryPromoKey,
  copy: HeaderCategoryPromoCopy,
): HeaderCategoryPromoText {
  if (key === "hardware") {
    return {
      badge: copy.badge,
      cta: copy.cta,
      headline: copy.hardwareHeadline,
      subline: copy.hardwareSubline,
    };
  }

  if (key === "generic") {
    return {
      badge: copy.badge,
      cta: copy.cta,
      headline: copy.genericHeadline,
      subline: copy.genericSubline,
    };
  }

  return {
    badge: copy.badge,
    cta: copy.cta,
    headline: copy.furnitureHeadline,
    subline: copy.furnitureSubline,
  };
}
