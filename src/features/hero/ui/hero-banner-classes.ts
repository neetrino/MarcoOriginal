/** SuperSudo hero-banner preview frames. */
export const HERO_DESKTOP_PREVIEW_CLASS = "aspect-[141/68] w-full";
export const HERO_MOBILE_PREVIEW_CLASS = "aspect-[399/288] w-full";

export const HERO_DESKTOP_RADIUS_CLASS = "rounded-[30px]";
export const HERO_MOBILE_RADIUS_CLASS = "rounded-[24px]";

export function heroBannerTabClass(isActive: boolean): string {
  return isActive
    ? "border-amber-500 bg-amber-50 text-amber-950 shadow-sm ring-1 ring-amber-200/80"
    : "border-gray-200 bg-white text-gray-600 hover:border-amber-200 hover:bg-amber-50/60 hover:text-gray-900";
}
