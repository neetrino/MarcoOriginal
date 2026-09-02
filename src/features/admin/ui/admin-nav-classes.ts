type AdminNavItemOptions = {
  active: boolean;
  isSubCategory?: boolean;
};

/** Desktop/mobile admin nav row — yellow active pill like the storefront. */
export function adminNavItemClass({
  active,
  isSubCategory = false,
}: AdminNavItemOptions): string {
  const layout = isSubCategory
    ? "gap-3 py-2.5 pr-4 pl-11"
    : "gap-3 px-3 py-2.5";
  const tone = active
    ? "bg-marco-yellow text-marco-slate"
    : "text-marco-slate/80 hover:bg-white hover:text-marco-ink";

  return `flex w-full shrink-0 items-center rounded-xl text-sm font-medium transition-colors ${layout} ${tone}`;
}

export function adminNavIconClass(active: boolean): string {
  return active ? "shrink-0 text-marco-slate" : "shrink-0 text-marco-slate/50";
}

/**
 * Products parent row. `overflow-hidden` clips the yellow pill; `shrink-0` is
 * required so flex column overflow scrolls the nav instead of collapsing this
 * row to 0 height (overflow ≠ visible zeroes the flex min-size).
 */
export function adminNavGroupClass(active: boolean): string {
  return `flex w-full min-w-0 shrink-0 overflow-hidden rounded-xl ${
    active ? "bg-marco-yellow text-marco-slate" : "bg-transparent"
  }`;
}

export function adminNavGroupLinkClass(active: boolean): string {
  const tone = active
    ? "text-marco-slate hover:bg-black/5"
    : "text-marco-slate/80 hover:bg-white hover:text-marco-ink";

  return `flex min-w-0 flex-1 items-center gap-3 px-3 py-2.5 text-left text-sm font-medium transition-colors ${tone}`;
}

export function adminNavGroupToggleClass(active: boolean): string {
  return active
    ? "shrink-0 border-l border-marco-slate/20 px-2 py-2.5 text-marco-slate hover:bg-black/5"
    : "shrink-0 border-l border-gray-200 px-2 py-2.5 text-marco-slate/60 hover:bg-white hover:text-marco-ink";
}

export const adminNavSeparatorClass = "mx-3 my-2 border-t border-gray-200";
