import { describe, expect, it } from "vitest";

import {
  draftsFromEndsAt,
  draftsFromStartsAt,
  isAutomaticDiscountCurrentlyActive,
  parseDiscountDateTimeInput,
  parseDiscountEndsAtInput,
  toDiscountDateTimeInput,
  toDiscountEndsAtInput,
} from "@/features/promotions/domain/discount-ends-at";

describe("parseDiscountDateTimeInput", () => {
  it("treats blank as cleared", () => {
    expect(parseDiscountDateTimeInput("")).toBeNull();
    expect(parseDiscountDateTimeInput("  ")).toBeNull();
  });

  it("parses YYYY-MM-DDTHH:mm as local wall time", () => {
    const parsed = parseDiscountDateTimeInput("2026-09-15T14:30");
    expect(parsed).toBeInstanceOf(Date);
    if (!(parsed instanceof Date)) return;
    expect(parsed.getFullYear()).toBe(2026);
    expect(parsed.getMonth()).toBe(8);
    expect(parsed.getDate()).toBe(15);
    expect(parsed.getHours()).toBe(14);
    expect(parsed.getMinutes()).toBe(30);
  });

  it("rejects invalid time components", () => {
    expect(parseDiscountDateTimeInput("2026-09-15T25:00")).toBe("invalid");
    expect(parseDiscountDateTimeInput("2026-09-15T12:60")).toBe("invalid");
  });
});

describe("parseDiscountEndsAtInput", () => {
  it("treats blank as cleared", () => {
    expect(parseDiscountEndsAtInput("")).toBeNull();
    expect(parseDiscountEndsAtInput("  ")).toBeNull();
  });

  it("parses a calendar day as inclusive end-of-day", () => {
    const parsed = parseDiscountEndsAtInput("2026-09-15");
    expect(parsed).toBeInstanceOf(Date);
    if (!(parsed instanceof Date)) return;
    expect(parsed.getFullYear()).toBe(2026);
    expect(parsed.getMonth()).toBe(8);
    expect(parsed.getDate()).toBe(15);
    expect(parsed.getHours()).toBe(23);
    expect(parsed.getMinutes()).toBe(59);
  });

  it("rejects malformed and impossible dates", () => {
    expect(parseDiscountEndsAtInput("15-09-2026")).toBe("invalid");
    expect(parseDiscountEndsAtInput("2026-13-01")).toBe("invalid");
    expect(parseDiscountEndsAtInput("2026-02-30")).toBe("invalid");
  });
});

describe("toDiscountDateTimeInput", () => {
  it("formats local datetime with hour and minute", () => {
    expect(toDiscountDateTimeInput(new Date(2026, 8, 15, 14, 30, 0))).toBe(
      "2026-09-15T14:30",
    );
    expect(toDiscountDateTimeInput(null)).toBe("");
  });
});

describe("toDiscountEndsAtInput", () => {
  it("formats local calendar days", () => {
    expect(toDiscountEndsAtInput(new Date(2026, 8, 15, 23, 59, 59))).toBe(
      "2026-09-15T23:59",
    );
    expect(toDiscountEndsAtInput(null)).toBe("");
  });
});

describe("draftsFromStartsAt", () => {
  it("maps saved start dates to input strings", () => {
    expect(
      draftsFromStartsAt([
        { id: "a", startsAt: "2026-09-15T09:00" },
        { id: "b", startsAt: null },
      ]),
    ).toEqual({ a: "2026-09-15T09:00", b: "" });
  });
});

describe("draftsFromEndsAt", () => {
  it("maps saved dates to input strings", () => {
    expect(
      draftsFromEndsAt([
        { id: "a", endsAt: "2026-09-15T18:00" },
        { id: "b", endsAt: null },
      ]),
    ).toEqual({ a: "2026-09-15T18:00", b: "" });
  });
});

describe("isAutomaticDiscountCurrentlyActive", () => {
  const now = new Date("2026-09-11T12:00:00.000Z");

  it("is active without a window", () => {
    expect(isAutomaticDiscountCurrentlyActive({ now })).toBe(true);
  });

  it("rejects future starts and past ends", () => {
    expect(
      isAutomaticDiscountCurrentlyActive({
        startsAt: new Date("2026-09-12T00:00:00.000Z"),
        now,
      }),
    ).toBe(false);
    expect(
      isAutomaticDiscountCurrentlyActive({
        endsAt: new Date("2026-09-10T23:59:59.000Z"),
        now,
      }),
    ).toBe(false);
  });
});
