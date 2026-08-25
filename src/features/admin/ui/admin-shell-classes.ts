/** Shared Tailwind classes: desktop admin sidebar flush to the viewport left edge. */
export const ADMIN_SIDEBAR_MOBILE_BAR =
  "sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-gray-200/80 bg-white/95 px-4 py-3 backdrop-blur-sm lg:hidden";

/** Desktop admin sidebar — fixed expanded width (`lg:w-64` in `AdminSidebar`). */
export const ADMIN_SIDEBAR_ASIDE =
  "hidden lg:flex lg:h-full lg:shrink-0 lg:flex-col overflow-hidden border-r border-gray-200 bg-white";

export const ADMIN_SIDEBAR_NAV =
  "flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto overscroll-y-contain py-4";

/** Desktop: viewport-height shell so only the main column scrolls; sidebar stays fixed. */
export const ADMIN_PAGE_SHELL =
  "flex min-h-screen flex-col bg-marco-gray lg:h-dvh lg:max-h-dvh lg:flex-row lg:overflow-hidden";

export const ADMIN_MAIN_COLUMN =
  "min-w-0 flex-1 px-4 pb-8 pt-5 sm:px-6 lg:min-h-0 lg:overflow-y-auto lg:overscroll-y-contain lg:px-8 lg:py-8";

export const ADMIN_MAIN_INNER = "mx-auto w-full max-w-7xl";
