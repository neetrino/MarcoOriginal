/** SuperSudo hero-banner preview frames. */
export const HERO_DESKTOP_PREVIEW_CLASS = "aspect-[141/68] w-full";
export const HERO_MOBILE_PREVIEW_CLASS = "aspect-[399/288] w-full";

export const HERO_DESKTOP_RADIUS_CLASS = "rounded-[30px]";
export const HERO_MOBILE_RADIUS_CLASS = "rounded-[24px]";

export function heroBannerTabClass(isActive: boolean): string {
  return isActive
    ? "border-marco-yellow bg-marco-yellow text-marco-slate shadow-sm"
    : "border-gray-200 bg-white text-marco-slate/70 hover:border-marco-yellow/60 hover:bg-marco-yellow/20 hover:text-marco-ink";
}
