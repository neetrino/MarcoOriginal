import { describe, expect, it } from "vitest";

import { buildCategoryTreeWithDistinctProductCounts } from "@/features/categories/domain/category-distinct-product-counts";
import { buildCategoryTree } from "@/features/categories/domain/category-tree";

describe("buildCategoryTreeWithDistinctProductCounts", () => {
  const rows = [
    { id: "root", parentId: null, title: "Root", slug: "root" },
    { id: "child-a", parentId: "root", title: "Child A", slug: "child-a" },
    { id: "child-b", parentId: "root", title: "Child B", slug: "child-b" },
  ];

  it("counts a product once when linked to parent and children", () => {
    const productIdsByCategoryId = new Map<string, Set<string>>([
      ["root", new Set(["p1", "p2"])],
      ["child-a", new Set(["p1", "p3"])],
      ["child-b", new Set(["p1", "p2"])],
    ]);

    const tree = buildCategoryTreeWithDistinctProductCounts(
      buildCategoryTree(rows),
      productIdsByCategoryId,
    );
    const root = tree[0];
    expect(root).toBeDefined();
    if (!root) return;

    expect(root.count).toBe(3);
    expect(root.children.map((child) => child.count)).toEqual([2, 2]);
  });

  it("does not inflate parent count by summing overlapping children", () => {
    const productIdsByCategoryId = new Map<string, Set<string>>([
      ["child-a", new Set(["p1", "p2"])],
      ["child-b", new Set(["p2", "p3"])],
    ]);

    const tree = buildCategoryTreeWithDistinctProductCounts(
      buildCategoryTree(rows),
      productIdsByCategoryId,
    );
    const root = tree[0];
    expect(root).toBeDefined();
    if (!root) return;

    expect(root.count).toBe(3);
    expect(root.children.map((child) => child.count)).toEqual([2, 2]);
  });
});
