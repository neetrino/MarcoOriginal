/**
 * Mobile hamburger popup — card overlay aligned with marco.am navigate menu.
 */

export const MOBILE_DRAWER_BACKDROP_CLASS =
  "absolute inset-0 bg-marco-black/20 backdrop-blur-[6px] transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]";

export const MOBILE_DRAWER_POPUP_SHELL_CLASS =
  "pointer-events-none absolute inset-x-0 bottom-[max(1rem,env(safe-area-inset-bottom))] top-28 flex justify-center overflow-visible px-5 pt-3 sm:px-6";

export const MOBILE_DRAWER_POPUP_CLASS =
  "pointer-events-auto relative w-full max-w-[22rem] min-w-0 transform-gpu will-change-transform transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]";

export const MOBILE_DRAWER_POPUP_CARD_CLASS =
  "flex max-h-full min-w-0 flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.16)] ring-1 ring-marco-black/5";

export const MOBILE_DRAWER_POPUP_BODY_CLASS =
  "flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-y-contain px-6 pb-6 pt-8";

export const MOBILE_DRAWER_CLOSE_BTN_CLASS =
  "absolute right-0 top-0 z-20 flex h-[3.25rem] w-[3.25rem] -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-marco-yellow text-marco-black shadow-[0_8px_24px_rgba(0,0,0,0.14)] transition-[filter,transform,opacity] duration-200 hover:brightness-95 active:scale-95";

export function mobileDrawerBackdropStateClass(entered: boolean): string {
  return entered ? "opacity-100" : "opacity-0";
}

export function mobileDrawerPopupStateClass(entered: boolean): string {
  return entered
    ? "translate-y-0 scale-100 opacity-100"
    : "translate-y-8 scale-95 opacity-0";
}

export function mobileDrawerCloseButtonStateClass(entered: boolean): string {
  return entered ? "opacity-100" : "scale-95 opacity-0";
}

/** Close control for full-height sheets (catalog filters, etc.). */
export const MOBILE_DRAWER_SHEET_CLOSE_BTN_CLASS =
  "absolute right-0 top-1/2 flex h-[52px] w-[52px] shrink-0 -translate-y-1/2 items-center justify-center rounded-full bg-marco-yellow text-marco-black transition-opacity hover:opacity-90";

export const MOBILE_DRAWER_MENU_HEADER_ROW_CLASS =
  "relative flex min-h-[52px] shrink-0 items-center justify-center px-1 pb-2 pt-1";

export const MOBILE_DRAWER_FOOTER_CLASS =
  "mt-auto border-t border-marco-black/8 pt-5";

export const MOBILE_DRAWER_PROFILE_BTN_CLASS =
  "inline-flex min-h-[2.75rem] shrink-0 items-center justify-center rounded-[1rem] bg-marco-yellow px-5 text-sm font-bold text-marco-black transition-[filter] duration-200 hover:brightness-95 active:brightness-90";

export const MOBILE_DRAWER_CTA_COMPACT_CLASS =
  "flex min-h-[2.75rem] w-full items-center justify-center gap-2 rounded-full bg-marco-yellow px-5 py-2.5 text-center text-xs font-bold uppercase tracking-wide text-marco-black transition-[filter] duration-200 hover:brightness-95 active:brightness-90";

export const MOBILE_DRAWER_CONTACT_COMPACT_CLASS =
  "flex min-h-[3.125rem] w-full items-center justify-center gap-2 rounded-full border-2 border-marco-black bg-white px-5 py-3 text-center text-xs font-bold tabular-nums text-marco-black transition-colors hover:bg-marco-gray/35";

export function mobileDrawerNavLinkClass(active: boolean): string {
  const base =
    "relative flex w-full items-center justify-between gap-3 py-3.5 pl-4 text-left text-[1.05rem] font-semibold leading-snug normal-case text-marco-black transition-colors duration-200";
  if (active) {
    return `${base} before:absolute before:left-0 before:top-1/2 before:h-5 before:w-1 before:-translate-y-1/2 before:rounded-full before:bg-marco-yellow before:content-['']`;
  }
  return `${base} hover:text-marco-black/65`;
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
