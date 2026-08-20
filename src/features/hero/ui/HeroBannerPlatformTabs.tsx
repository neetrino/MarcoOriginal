"use client";

import { heroBannerTabClass } from "@/features/hero/ui/hero-banner-classes";

export type HeroBannerPlatformTab = "desktop" | "mobile";

type HeroBannerPlatformTabsProps = {
  activeTab: HeroBannerPlatformTab;
  onTabChange: (tab: HeroBannerPlatformTab) => void;
};

export function HeroBannerPlatformTabs({
  activeTab,
  onTabChange,
}: HeroBannerPlatformTabsProps) {
  return (
    <div
      className="flex flex-wrap gap-2"
      role="tablist"
      aria-label="Banner platform"
    >
      <button
        type="button"
        role="tab"
        aria-selected={activeTab === "desktop"}
        id="admin-hero-banner-tab-desktop"
        aria-controls="admin-hero-banner-panel-desktop"
        className={`inline-flex min-h-11 items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${heroBannerTabClass(activeTab === "desktop")}`}
        onClick={() => onTabChange("desktop")}
      >
        <svg
          className="h-4 w-4 shrink-0 opacity-70"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
        Desktop
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={activeTab === "mobile"}
        id="admin-hero-banner-tab-mobile"
        aria-controls="admin-hero-banner-panel-mobile"
        className={`inline-flex min-h-11 items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${heroBannerTabClass(activeTab === "mobile")}`}
        onClick={() => onTabChange("mobile")}
      >
        <svg
          className="h-4 w-4 shrink-0 opacity-70"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
        Mobile
      </button>
    </div>
  );
}
