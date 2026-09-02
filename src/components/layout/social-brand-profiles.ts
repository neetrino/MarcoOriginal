import type { Dictionary } from "@/lib/i18n/get-dictionary";

export type SocialBrandProfile = {
  label: string;
  href: string;
  /** Optional second line (e.g. phone under a branch name). */
  subtitle?: string;
};

export type SocialBrandMenus = {
  instagram: readonly SocialBrandProfile[];
  facebook: readonly SocialBrandProfile[];
  instagramMenuLabel: string;
  facebookMenuLabel: string;
};

const INSTAGRAM_HREFS = {
  marcoGroup: "https://www.instagram.com/_marcogroup_/",
  marcoElectronics: "https://www.instagram.com/marco_electronics/",
} as const;

const FACEBOOK_HREFS = {
  marcoGroup: "https://www.facebook.com/marcofurniture?locale=ru_RU",
  marcoElectronics: "https://www.facebook.com/marcoelectronicss?locale=ru_RU",
} as const;

/**
 * Instagram and Facebook each open two brand profiles.
 */
export function buildSocialBrandMenus(dictionary: Dictionary): SocialBrandMenus {
  const brands = dictionary.header.socialBrands;

  return {
    instagram: [
      { label: brands.marcoGroup, href: INSTAGRAM_HREFS.marcoGroup },
      { label: brands.marcoElectronics, href: INSTAGRAM_HREFS.marcoElectronics },
    ],
    facebook: [
      { label: brands.marcoGroup, href: FACEBOOK_HREFS.marcoGroup },
      { label: brands.marcoElectronics, href: FACEBOOK_HREFS.marcoElectronics },
    ],
    instagramMenuLabel: brands.instagramMenu,
    facebookMenuLabel: brands.facebookMenu,
  };
}
