/** Admin discounts board — aligned with marco.am supersudo/discounts. */

export const DISCOUNT_PAGE_SHELL =
  "flex min-h-[calc(100dvh-11rem)] flex-col";

export const DISCOUNT_BOARD_CARD =
  "flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-gradient-to-br from-white via-white to-marco-gray/40 p-4 shadow-[0_14px_36px_rgba(15,23,42,0.08)] sm:p-6";

export const DISCOUNT_TABLIST =
  "flex gap-1 overflow-x-auto rounded-xl border-2 border-gray-200 bg-gray-100 p-1.5 shadow-inner";

export const DISCOUNT_TAB_BASE =
  "min-w-0 flex-1 rounded-lg px-2 py-2.5 text-center text-xs font-bold transition-all sm:px-4 sm:py-3 sm:text-sm";

export const DISCOUNT_TAB_ACTIVE =
  "bg-marco-yellow text-marco-slate shadow-md ring-1 ring-marco-yellow/70";

export const DISCOUNT_TAB_IDLE =
  "bg-transparent text-gray-500 hover:bg-white/90 hover:text-marco-ink";

export const DISCOUNT_PANEL =
  "mt-5 flex min-h-0 flex-1 flex-col";

export const DISCOUNT_GLOBAL_CARD =
  "rounded-xl border border-rose-100 bg-gradient-to-br from-rose-50/70 via-white to-orange-50/70 p-4 shadow-[0_8px_24px_rgba(244,63,94,0.12)]";

export const DISCOUNT_INFO_CARD =
  "rounded-xl border border-sky-100 bg-gradient-to-br from-sky-50/60 via-white to-indigo-50/50 p-4 shadow-[0_8px_24px_rgba(56,189,248,0.12)]";

export const DISCOUNT_SECTION_CARD =
  "flex min-h-0 flex-1 flex-col rounded-xl border border-gray-200/80 bg-white/95 p-4 shadow-[0_12px_28px_rgba(15,23,42,0.07)] sm:p-5";

export const DISCOUNT_ICON_ROSE =
  "flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-orange-500 text-white shadow-sm";

export const DISCOUNT_ICON_SKY =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 text-white shadow-sm";

export const DISCOUNT_FIELD =
  "h-10 w-24 rounded-lg border border-gray-300 bg-white px-3 text-sm text-marco-ink outline-none transition-colors focus:border-marco-slate focus:ring-2 focus:ring-marco-slate/10 disabled:opacity-50";

export const DISCOUNT_SEARCH_FIELD =
  "h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-marco-ink outline-none transition-colors placeholder:text-marco-slate/50 focus:border-marco-slate focus:ring-2 focus:ring-marco-slate/10";

export const DISCOUNT_PRIMARY_BUTTON =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-marco-yellow px-5 py-2.5 text-sm font-semibold text-marco-slate shadow-sm transition-all hover:-translate-y-0.5 hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marco-yellow/40 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0";

export const DISCOUNT_GHOST_BUTTON =
  "inline-flex shrink-0 items-center justify-center rounded-xl px-4 py-2 text-sm font-medium text-marco-slate/80 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50";

export const DISCOUNT_QUICK_BUTTON =
  "w-full rounded-lg border border-rose-200 px-3 py-1.5 text-sm font-medium text-marco-slate transition-colors hover:bg-rose-50 disabled:opacity-50";

export const DISCOUNT_STATUS_ACTIVE =
  "rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800";

export const DISCOUNT_STATUS_IDLE =
  "rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-600";

export const DISCOUNT_EMPTY =
  "rounded-lg border border-dashed border-gray-300 py-8 text-center text-sm text-gray-600";

export const DISCOUNT_TREE_LIST =
  "min-h-0 flex-1 overflow-y-auto rounded-xl border border-gray-100 bg-marco-gray/50 p-2";

export const DISCOUNT_TREE_ROW =
  "mb-2 flex items-center gap-2 rounded-lg border border-transparent bg-white px-3 py-3 shadow-[0_2px_8px_rgba(15,23,42,0.04)] transition-all duration-200 last:mb-0 hover:-translate-y-0.5 hover:border-amber-200 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-amber-50 hover:shadow-[0_10px_24px_rgba(120,53,15,0.16)]";

export const DISCOUNT_PRODUCT_ROW =
  "flex flex-wrap items-center gap-4 rounded-xl border border-gray-200/80 bg-gradient-to-r from-white to-marco-gray/40 p-3 shadow-[0_2px_8px_rgba(15,23,42,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-[0_10px_24px_rgba(15,23,42,0.08)]";

export const DISCOUNT_SALE_BADGE =
  "rounded-full bg-rose-100 px-2 py-0.5 text-xs font-semibold text-rose-700";

export function discountTabClass(isActive: boolean): string {
  return `${DISCOUNT_TAB_BASE} ${isActive ? DISCOUNT_TAB_ACTIVE : DISCOUNT_TAB_IDLE}`;
}
