import { describe, expect, it } from "vitest";

import { buildAdminPaginationItems } from "@/features/products/domain/admin-table-pagination";

describe("buildAdminPaginationItems", () => {
  it("lists every page when the range is short", () => {
    expect(buildAdminPaginationItems(2, 4)).toEqual([1, 2, 3, 4]);
  });

  it("keeps a window around the current page", () => {
    expect(buildAdminPaginationItems(6, 12)).toEqual([
      1,
      "ellipsis",
      5,
      6,
      7,
      "ellipsis",
      12,
    ]);
  });
});
