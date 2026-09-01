import { describe, expect, it } from "vitest";

import { buildCategoryTree } from "@/features/categories/domain/category-tree";
import {
  buildCategoryFacetsWithDistinctCounts,
  pruneEmptyCategoryFacets,
} from "@/features/products/domain/catalog-category-facet-counts";

describe("buildCategoryFacetsWithDistinctCounts", () => {
  const rows = [
    {
      id: "root",
      parentId: null,
      title: "Root",
      slug: "root",
    },
    {
      id: "child-a",
      parentId: "root",
      title: "Child A",
      slug: "child-a",
    },
    {
      id: "child-b",
      parentId: "root",
      title: "Child B",
      slug: "child-b",
    },
  ];

  it("counts a product once when linked to parent and children", () => {
    const productIdsByCategoryId = new Map<string, Set<string>>([
      ["root", new Set(["p1", "p2"])],
      ["child-a", new Set(["p1", "p3"])],
      ["child-b", new Set(["p1", "p2"])],
    ]);

    const facets = buildCategoryFacetsWithDistinctCounts(
      buildCategoryTree(rows),
      productIdsByCategoryId,
    );
    const root = facets[0];
    expect(root).toBeDefined();
    if (!root) return;

    expect(root.count).toBe(3);
    expect(root.children.map((child) => child.count)).toEqual([2, 2]);
  });

  it("uses only direct products when a node has no children", () => {
    const productIdsByCategoryId = new Map<string, Set<string>>([
      ["leaf", new Set(["p1", "p2"])],
    ]);

    const facets = buildCategoryFacetsWithDistinctCounts(
      buildCategoryTree([
        { id: "leaf", parentId: null, title: "Leaf", slug: "leaf" },
      ]),
      productIdsByCategoryId,
    );
    const leaf = facets[0];
    expect(leaf).toBeDefined();
    if (!leaf) return;

    expect(leaf.count).toBe(2);
  });
});

describe("pruneEmptyCategoryFacets", () => {
  it("removes zero-count leaves and empty parents", () => {
    const pruned = pruneEmptyCategoryFacets([
      {
        id: "priced",
        slug: "priced",
        title: "Priced",
        count: 2,
        children: [],
      },
      {
        id: "empty-root",
        slug: "empty-root",
        title: "Empty",
        count: 0,
        children: [
          {
            id: "empty-child",
            slug: "empty-child",
            title: "Empty child",
            count: 0,
            children: [],
          },
        ],
      },
    ]);

    expect(pruned).toEqual([
      {
        id: "priced",
        slug: "priced",
        title: "Priced",
        count: 2,
        children: [],
      },
    ]);
  });
});
