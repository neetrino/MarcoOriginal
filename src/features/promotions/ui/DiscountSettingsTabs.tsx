"use client";

import {
  DISCOUNT_TABLIST,
  discountTabClass,
} from "@/features/promotions/ui/discount-admin.classes";
import {
  DISCOUNT_TAB_IDS,
  type DiscountSettingsTabId,
} from "@/features/promotions/ui/discount-settings-tabs";

type DiscountSettingsTabsProps = {
  labels: Record<DiscountSettingsTabId, string>;
  tabsLabel: string;
  activeTab: DiscountSettingsTabId;
  onTabChange: (tab: DiscountSettingsTabId) => void;
};

export function DiscountSettingsTabs({
  labels,
  tabsLabel,
  activeTab,
  onTabChange,
}: DiscountSettingsTabsProps) {
  return (
    <div role="tablist" aria-label={tabsLabel} className={DISCOUNT_TABLIST}>
      {DISCOUNT_TAB_IDS.map((tabId) => {
        const isActive = activeTab === tabId;
        return (
          <button
            key={tabId}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={`discount-settings-panel-${tabId}`}
            id={`discount-settings-tab-${tabId}`}
            onClick={() => onTabChange(tabId)}
            className={discountTabClass(isActive)}
          >
            {labels[tabId]}
          </button>
        );
      })}
    </div>
  );
}
