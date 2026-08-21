export const DISCOUNT_TAB_IDS = ["global", "category", "product"] as const;

export type DiscountSettingsTabId = (typeof DISCOUNT_TAB_IDS)[number];

export function isDiscountSettingsTab(
  value: string,
): value is DiscountSettingsTabId {
  return (DISCOUNT_TAB_IDS as readonly string[]).includes(value);
}
