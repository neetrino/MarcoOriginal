import { describe, expect, it } from "vitest";

import {
  draftsFromEndsAt,
  isAutomaticDiscountCurrentlyActive,
  parseDiscountEndsAtInput,
  toDiscountEndsAtInput,
} from "@/features/promotions/domain/discount-ends-at";

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

describe("toDiscountEndsAtInput", () => {
  it("formats local calendar days", () => {
    expect(toDiscountEndsAtInput(new Date(2026, 8, 15, 23, 59, 59))).toBe(
      "2026-09-15",
    );
    expect(toDiscountEndsAtInput(null)).toBe("");
  });
});

describe("draftsFromEndsAt", () => {
  it("maps saved dates to input strings", () => {
    expect(
      draftsFromEndsAt([
        { id: "a", endsAt: "2026-09-15" },
        { id: "b", endsAt: null },
      ]),
    ).toEqual({ a: "2026-09-15", b: "" });
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
