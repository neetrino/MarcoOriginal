import { describe, expect, it } from "vitest";

import { collectChangedDiscountRows } from "@/features/promotions/ui/discount-dirty";

describe("collectChangedDiscountRows", () => {
  const rows = [
    {
      id: "a",
      title: "Alpha",
      discountPercent: 10,
      startsAt: "2026-09-10T09:00",
      endsAt: "2026-09-20T18:00",
    },
    {
      id: "b",
      title: "Beta",
      discountPercent: null,
      startsAt: null,
      endsAt: null,
    },
  ];

  it("returns only changed rows", () => {
    const result = collectChangedDiscountRows(
      rows,
      { a: "10", b: "15" },
      { a: "2026-09-10T09:00", b: "" },
      { a: "2026-09-20T18:00", b: "" },
    );
    expect(result).toEqual({
      ok: true,
      changes: [
        {
          id: "b",
          title: "Beta",
          discountPercent: null,
          startsAt: null,
          endsAt: null,
          percentage: 15,
        },
      ],
    });
  });

  it("includes clears as changes", () => {
    const result = collectChangedDiscountRows(
      rows,
      { a: "", b: "" },
      { a: "", b: "" },
      { a: "", b: "" },
    );
    expect(result).toEqual({
      ok: true,
      changes: [
        {
          id: "a",
          title: "Alpha",
          discountPercent: 10,
          startsAt: null,
          endsAt: null,
          percentage: null,
        },
      ],
    });
  });

  it("treats zero as a clear change", () => {
    const result = collectChangedDiscountRows(
      rows,
      { a: "0", b: "" },
      { a: "", b: "" },
      { a: "", b: "" },
    );
    expect(result).toEqual({
      ok: true,
      changes: [
        {
          id: "a",
          title: "Alpha",
          discountPercent: 10,
          startsAt: null,
          endsAt: null,
          percentage: null,
        },
      ],
    });
  });

  it("detects schedule-only changes", () => {
    const result = collectChangedDiscountRows(
      rows,
      { a: "10", b: "" },
      { a: "2026-09-11T10:00", b: "" },
      { a: "2026-09-20T18:00", b: "" },
    );
    expect(result).toEqual({
      ok: true,
      changes: [
        {
          id: "a",
          title: "Alpha",
          discountPercent: 10,
          startsAt: "2026-09-11T10:00",
          endsAt: "2026-09-20T18:00",
          percentage: 10,
        },
      ],
    });
  });
});
