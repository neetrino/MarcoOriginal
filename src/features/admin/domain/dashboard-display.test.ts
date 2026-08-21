import { describe, expect, it } from "vitest";

import {
  formatDashboardUserName,
  getDashboardInitials,
  localDayBounds,
  localMonthBounds,
} from "@/features/admin/domain/dashboard-display";

describe("dashboard display helpers", () => {
  it("builds initials from one or two name parts", () => {
    expect(getDashboardInitials("")).toBe("U");
    expect(getDashboardInitials("Anna")).toBe("AN");
    expect(getDashboardInitials("Anna Hakobyan")).toBe("AH");
  });

  it("falls back when both name parts are empty", () => {
    expect(formatDashboardUserName("", "", "guest@shop.am")).toBe(
      "guest@shop.am",
    );
    expect(formatDashboardUserName("Anna", "Hakobyan", "x")).toBe(
      "Anna Hakobyan",
    );
  });

  it("starts today and this month in local time", () => {
    const now = new Date(2026, 7, 21, 18, 0, 0);
    expect(localDayBounds(now).start).toEqual(new Date(2026, 7, 21));
    expect(localMonthBounds(now).start).toEqual(new Date(2026, 7, 1));
    expect(localDayBounds(now).end).toBe(now);
  });
});
