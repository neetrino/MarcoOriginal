import { describe, expect, it } from "vitest";

import { formatNumericDate } from "@/lib/i18n/format-date";

describe("formatNumericDate", () => {
  const sample = new Date(2026, 7, 31);

  it("formats hy and ru as DD.MM.YYYY", () => {
    expect(formatNumericDate(sample, "hy")).toBe("31.08.2026");
    expect(formatNumericDate(sample, "ru")).toBe("31.08.2026");
  });

  it("formats en as MM/DD/YYYY", () => {
    expect(formatNumericDate(sample, "en")).toBe("08/31/2026");
  });

  it("is stable for ISO strings", () => {
    expect(formatNumericDate(sample.toISOString(), "hy")).toBe(
      formatNumericDate(sample, "hy"),
    );
  });
});
