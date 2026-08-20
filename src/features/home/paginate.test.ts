import { describe, expect, it } from "vitest";

import { chunkItems, paginateItems } from "@/features/home/paginate";

describe("paginateItems", () => {
  const items = ["a", "b", "c", "d", "e"];

  it("returns the requested page slice", () => {
    expect(paginateItems(items, 2, 2)).toEqual({
      pageItems: ["c", "d"],
      page: 2,
      totalPages: 3,
    });
  });

  it("clamps an oversized page to the last page", () => {
    expect(paginateItems(items, 99, 2).page).toBe(3);
  });

  it("treats an empty list as a single empty page", () => {
    expect(paginateItems([], 1, 8)).toEqual({
      pageItems: [],
      page: 1,
      totalPages: 1,
    });
  });
});

describe("chunkItems", () => {
  const items = ["a", "b", "c", "d", "e"];

  it("chunks items into fixed-size pages", () => {
    expect(chunkItems(items, 2)).toEqual([["a", "b"], ["c", "d"], ["e"]]);
  });

  it("returns no pages for an empty list", () => {
    expect(chunkItems([], 4)).toEqual([]);
  });
});
