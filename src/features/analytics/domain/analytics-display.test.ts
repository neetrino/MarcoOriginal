import { describe, expect, it } from "vitest";

import {
  analyticsLowStockMax,
  analyticsRankClass,
  analyticsStatusBucket,
  emptyAnalyticsStatusCounts,
} from "@/features/analytics/domain/analytics-display";
import { pickBestAndLeastSelling } from "@/features/analytics/domain/pick-product-sales";

describe("analyticsStatusBucket", () => {
  it("groups fulfillment statuses onto breakdown columns", () => {
    expect(analyticsStatusBucket("PENDING")).toBe("pending");
    expect(analyticsStatusBucket("CONFIRMED")).toBe("pending");
    expect(analyticsStatusBucket("PROCESSING")).toBe("processing");
    expect(analyticsStatusBucket("SHIPPED")).toBe("processing");
    expect(analyticsStatusBucket("DELIVERED")).toBe("completed");
    expect(analyticsStatusBucket("CANCELLED")).toBe("cancelled");
    expect(analyticsStatusBucket("REFUNDED")).toBe("cancelled");
  });
});

describe("emptyAnalyticsStatusCounts", () => {
  it("starts every bucket at zero", () => {
    expect(emptyAnalyticsStatusCounts()).toEqual({
      pending: 0,
      processing: 0,
      completed: 0,
      cancelled: 0,
      other: 0,
    });
  });
});

describe("analyticsLowStockMax", () => {
  it("uses threshold minus one and never goes negative", () => {
    expect(analyticsLowStockMax(5)).toBe(4);
    expect(analyticsLowStockMax(0)).toBe(0);
  });
});

describe("analyticsRankClass", () => {
  it("uses medal colors for the first three ranks", () => {
    expect(analyticsRankClass(1)).toContain("bg-yellow-400");
    expect(analyticsRankClass(2)).toContain("bg-gray-300");
    expect(analyticsRankClass(3)).toContain("bg-orange-300");
    expect(analyticsRankClass(4)).toContain("bg-gray-200");
  });
});

describe("pickBestAndLeastSelling", () => {
  it("keeps top sellers and least sellers disjoint", () => {
    const rows = [
      { productId: "a", quantitySold: 10 },
      { productId: "b", quantitySold: 8 },
      { productId: "c", quantitySold: 3 },
      { productId: "d", quantitySold: 1 },
    ];

    const picked = pickBestAndLeastSelling(rows, 2);

    expect(picked.bestSelling.map((row) => row.productId)).toEqual(["a", "b"]);
    expect(picked.leastSelling.map((row) => row.productId)).toEqual(["d", "c"]);
  });
});
