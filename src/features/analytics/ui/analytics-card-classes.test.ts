import { describe, expect, it } from "vitest";

import {
  ANALYTICS_ACCENT_CLASS,
  ANALYTICS_PANEL_CLASS,
  ANALYTICS_ROW_CLASS,
} from "@/features/analytics/ui/analytics-card-classes";

describe("analytics card classes", () => {
  it("uses yellow accents and hover lift on rows", () => {
    expect(ANALYTICS_ACCENT_CLASS).toContain("from-marco-yellow");
    expect(ANALYTICS_PANEL_CLASS).toContain("rounded-2xl");
    expect(ANALYTICS_ROW_CLASS).toContain("hover:border-marco-yellow/60");
  });
});
