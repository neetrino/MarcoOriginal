/** Shared header width + padding — matches storefront `max-w-7xl`. */
export const SITE_HEADER_INNER =
  "mx-auto max-w-7xl px-4 sm:px-6 lg:max-[1366px]:px-8 min-[1367px]:!px-[15px]";

export const HEADER_SOCIAL_CIRCLE_CLASS =
  "flex shrink-0 items-center justify-center rounded-full border border-marco-black/10 bg-marco-yellow text-marco-slate transition-[filter] hover:brightness-95 active:brightness-90";

export const HEADER_SOCIAL_CIRCLE_SIZE_CLASS =
  "h-11 w-11 min-[1367px]:h-9 min-[1367px]:w-9";

export const FOOTER_SOCIAL_CIRCLE_SIZE_CLASS = "h-9 w-9";

/**
 * Mobile header round controls — padding-sized so the menu stays a 44px circle
 * (`p-2.5` + 24px glyph) while the locale pill can grow with `gap-1 px-3`.
 */
export const HEADER_MOBILE_ROUND_CONTROL_CLASS =
  "flex shrink-0 items-center justify-center rounded-full bg-marco-slate p-2.5 text-white shadow-sm transition-[opacity,filter] hover:opacity-95 active:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marco-slate/25";

export const HEADER_CATEGORIES_PILL_CLASS =
  "hidden h-10 shrink-0 items-center justify-center rounded-[89px] bg-marco-slate px-4 text-xs font-medium text-white transition-[opacity,filter] hover:opacity-95 active:opacity-90 min-[1180px]:inline-flex min-[1180px]:w-[11.5rem]";

export const HEADER_SEARCH_SUBMIT_CLASS =
  "flex h-10 w-[7.375rem] shrink-0 items-center justify-center rounded-[89px] bg-marco-yellow px-3 text-xs font-semibold text-marco-slate transition-[filter] hover:brightness-95 active:brightness-90";

/**
 * Desktop primary nav — active page is a yellow pill; hover grows an underline.
 */
export function headerPrimaryNavClass(active: boolean): string {
  const shell =
    "relative z-0 inline-flex h-10 shrink-0 items-center whitespace-nowrap text-xs font-bold capitalize leading-[18px] transition-colors duration-200 " +
    "before:pointer-events-none before:absolute before:left-1/2 before:top-1/2 before:z-[-1] " +
    "before:h-9 before:w-[calc(100%+20px)] before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full " +
    "before:bg-marco-yellow before:content-[''] before:transition-opacity before:duration-200 " +
    "after:pointer-events-none after:absolute after:inset-x-0 after:bottom-2 after:block after:h-1 after:origin-left " +
    "after:scale-x-0 after:bg-marco-yellow after:content-[''] after:transition-transform after:duration-300 after:ease-out " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marco-slate/25";

  if (active) {
    return `${shell} before:opacity-100 after:scale-x-0 text-marco-slate`;
  }

  return `${shell} before:opacity-0 hover:after:scale-x-100 text-marco-slate`;
}
