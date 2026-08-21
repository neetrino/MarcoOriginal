/**
 * Mobile hamburger sheet — pill rows aligned with the marco.am navigate menu.
 */

export const MOBILE_DRAWER_PANEL_CLASS =
  "flex h-[100dvh] max-h-[100dvh] w-full min-w-0 flex-col overflow-hidden bg-marco-footer pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]";

export const MOBILE_DRAWER_CONTENT_MAX_CLASS = "mx-auto w-full min-w-0 max-w-full";

export const MOBILE_DRAWER_CLOSE_BTN_CLASS =
  "absolute right-0 top-1/2 mt-4 flex h-[52px] w-[52px] shrink-0 -translate-y-1/2 items-center justify-center rounded-full bg-marco-yellow text-marco-black transition-opacity hover:opacity-90";

export const MOBILE_DRAWER_MENU_HEADER_ROW_CLASS =
  "relative flex min-h-[52px] shrink-0 items-center justify-center px-1 pb-2 pt-1";

export const MOBILE_DRAWER_CTA_COMPACT_CLASS =
  "flex min-h-[2.75rem] w-full items-center justify-center gap-2 rounded-full bg-marco-yellow px-5 py-2.5 text-center text-xs font-bold uppercase tracking-wide text-marco-black transition-[filter] duration-200 hover:brightness-95 active:brightness-90";

export const MOBILE_DRAWER_CONTACT_COMPACT_CLASS =
  "flex min-h-[3.125rem] w-full items-center justify-center gap-2 rounded-full border-2 border-marco-black bg-white px-5 py-3 text-center text-xs font-bold tabular-nums text-marco-black transition-colors hover:bg-marco-gray/35";

export function mobileDrawerNavPillClass(active: boolean): string {
  const base =
    "flex min-h-[3.5rem] w-full items-center justify-between gap-3.5 rounded-full border px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wide transition-[background-color,border-color,color,filter] duration-200";
  if (active) {
    return `${base} border-transparent bg-marco-yellow text-marco-black`;
  }
  return `${base} border-marco-black/12 bg-white text-marco-black hover:border-marco-black/30`;
}

export function mobileDrawerCompactPillClass(
  active: boolean,
  centered = false,
): string {
  const justify = centered ? "justify-center" : "justify-between";
  const textAlign = centered ? "text-center" : "text-left";
  const base = `flex min-h-[3.125rem] w-full items-center ${justify} gap-2.5 rounded-full border px-6 py-3.5 ${textAlign} text-xs font-semibold leading-snug normal-case transition-[background-color,border-color,color,filter] duration-200`;
  if (active) {
    return `${base} border-transparent bg-marco-yellow text-marco-black`;
  }
  return `${base} border-marco-black/12 bg-white text-marco-black hover:border-marco-black/25`;
}
