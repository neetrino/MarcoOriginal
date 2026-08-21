import { describe, expect, it } from "vitest";

import {
  DASHBOARD_ROW_CLASS,
  DASHBOARD_STAT_ACCENT_CLASS,
  DASHBOARD_STAT_CARD_CLASS,
  DASHBOARD_VIEW_ALL_CLASS,
} from "@/features/admin/ui/dashboard-card-classes";

describe("dashboard card classes", () => {
  it("uses yellow hover and lift on stat and list rows", () => {
    expect(DASHBOARD_STAT_CARD_CLASS).toContain("hover:border-marco-yellow/60");
    expect(DASHBOARD_STAT_CARD_CLASS).toContain("hover:-translate-y-1");
    expect(DASHBOARD_ROW_CLASS).toContain("hover:bg-marco-yellow/10");
    expect(DASHBOARD_VIEW_ALL_CLASS).toContain("rounded-xl");
  });

  it("keeps the yellow accent bar on metric cards", () => {
    expect(DASHBOARD_STAT_ACCENT_CLASS).toContain("from-marco-yellow");
  });
});
