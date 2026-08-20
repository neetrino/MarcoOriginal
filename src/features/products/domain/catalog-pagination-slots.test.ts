import { describe, expect, it } from "vitest";

import { catalogPaginationSlots } from "@/features/products/domain/catalog-pagination-slots";

describe("catalogPaginationSlots", () => {
  it("lists every page when there are at most seven", () => {
    expect(catalogPaginationSlots(5, 3)).toEqual([1, 2, 3, 4, 5]);
  });

  it("inserts ellipses around the current window on long ranges", () => {
    expect(catalogPaginationSlots(20, 10)).toEqual([
      1,
      "ellipsis",
      9,
      10,
      11,
      "ellipsis",
      20,
    ]);
  });
});
