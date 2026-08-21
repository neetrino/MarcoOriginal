import { describe, expect, it } from "vitest";

import {
  formatAdminMessage,
  getAdminCopy,
  resolveAdminLocale,
} from "@/features/admin/ui/get-admin-copy";
import { getAdminMenuItems } from "@/features/admin/ui/admin-menu.config";

describe("getAdminCopy", () => {
  it("resolves unknown locale to the default catalog", () => {
    expect(resolveAdminLocale("xx")).toBe("hy");
    expect(getAdminCopy("xx").nav.dashboard).toBe(
      getAdminCopy("hy").nav.dashboard,
    );
  });

  it("formats catalog tokens", () => {
    expect(
      formatAdminMessage("Page {page} / {total}", { page: 2, total: 5 }),
    ).toBe("Page 2 / 5");
  });

  it("labels admin menu items from the locale catalog", () => {
    const hy = getAdminMenuItems("hy");
    const en = getAdminMenuItems("en");
    const ru = getAdminMenuItems("ru");

    expect(hy.find((item) => item.id === "dashboard")?.label).toBe("Վահանակ");
    expect(en.find((item) => item.id === "orders")?.label).toBe("Orders");
    expect(ru.find((item) => item.id === "settings")?.label).toBe("Настройки");
  });
});
