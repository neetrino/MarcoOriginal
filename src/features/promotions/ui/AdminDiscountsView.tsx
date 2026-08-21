"use client";

import { useState } from "react";

import { getAdminCopy } from "@/features/admin/ui/get-admin-copy";
import type { AdminDiscountsBoard } from "@/features/promotions/application/discounts-board";
import { CategoryDiscountsSection } from "@/features/promotions/ui/CategoryDiscountsSection";
import { DiscountInfoCard } from "@/features/promotions/ui/DiscountInfoCard";
import { DiscountSettingsTabs } from "@/features/promotions/ui/DiscountSettingsTabs";
import { GlobalDiscountCard } from "@/features/promotions/ui/GlobalDiscountCard";
import { ProductDiscountsSection } from "@/features/promotions/ui/ProductDiscountsSection";
import {
  DISCOUNT_BOARD_CARD,
  DISCOUNT_PAGE_SHELL,
  DISCOUNT_PANEL,
} from "@/features/promotions/ui/discount-admin.classes";
import type { DiscountSettingsTabId } from "@/features/promotions/ui/discount-settings-tabs";

type AdminDiscountsViewProps = {
  locale: string;
  board: AdminDiscountsBoard;
};

export function AdminDiscountsView({
  locale,
  board,
}: AdminDiscountsViewProps) {
  const copy = getAdminCopy(locale).discounts;
  const [activeTab, setActiveTab] = useState<DiscountSettingsTabId>("global");

  return (
    <div className={DISCOUNT_PAGE_SHELL}>
      <div className={DISCOUNT_BOARD_CARD}>
        <DiscountSettingsTabs
          labels={copy.tabs}
          tabsLabel={copy.tabsLabel}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className={DISCOUNT_PANEL}>
          {activeTab === "global" ? (
            <div
              role="tabpanel"
              id="discount-settings-panel-global"
              aria-labelledby="discount-settings-tab-global"
              className="grid grid-cols-1 gap-5 md:grid-cols-2"
            >
              <GlobalDiscountCard
                locale={locale}
                initialPercent={board.globalPercent}
              />
              <DiscountInfoCard locale={locale} />
            </div>
          ) : null}

          {activeTab === "category" ? (
            <div
              role="tabpanel"
              id="discount-settings-panel-category"
              aria-labelledby="discount-settings-tab-category"
              className="flex min-h-0 flex-1 flex-col"
            >
              <CategoryDiscountsSection
                locale={locale}
                categories={board.categories}
              />
            </div>
          ) : null}

          {activeTab === "product" ? (
            <div
              role="tabpanel"
              id="discount-settings-panel-product"
              aria-labelledby="discount-settings-tab-product"
              className="flex min-h-0 flex-1 flex-col"
            >
              <ProductDiscountsSection
                locale={locale}
                products={board.products}
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
