import { describe, expect, it } from "vitest";

import { buildCategoryTree } from "@/features/categories/domain/category-tree";
import {
  buildCategoryFacetsWithDistinctCounts,
  findCategoryFacetBySlug,
  mergeCategoryFacetsByPricePresence,
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

describe("mergeCategoryFacetsByPricePresence", () => {
  it("keeps alternate-only categories and forces the other price mode", () => {
    const merged = mergeCategoryFacetsByPricePresence(
      [
        {
          id: "priced",
          slug: "priced",
          title: "Priced",
          count: 4,
          children: [],
        },
      ],
      [
        {
          id: "hardware",
          slug: "hardware",
          title: "Hardware",
          count: 12,
          children: [
            {
              id: "lam",
              slug: "lam",
              title: "Laminate",
              count: 5,
              children: [],
            },
          ],
        },
      ],
      "without",
    );

    expect(merged).toEqual([
      {
        id: "priced",
        slug: "priced",
        title: "Priced",
        count: 4,
        children: [],
      },
      {
        id: "hardware",
        slug: "hardware",
        title: "Hardware",
        count: 12,
        forcePricePresence: "without",
        children: [
          {
            id: "lam",
            slug: "lam",
            title: "Laminate",
            count: 5,
            forcePricePresence: "without",
            children: [],
          },
        ],
      },
    ]);
  });

  it("prefers active-mode count when both modes have products", () => {
    const merged = mergeCategoryFacetsByPricePresence(
      [
        {
          id: "shared",
          slug: "shared",
          title: "Shared",
          count: 3,
          children: [],
        },
      ],
      [
        {
          id: "shared",
          slug: "shared",
          title: "Shared",
          count: 9,
          children: [],
        },
      ],
      "without",
    );

    expect(merged).toEqual([
      {
        id: "shared",
        slug: "shared",
        title: "Shared",
        count: 3,
        children: [],
      },
    ]);
  });
});

describe("findCategoryFacetBySlug", () => {
  it("finds nested facets", () => {
    const found = findCategoryFacetBySlug(
      [
        {
          id: "root",
          slug: "root",
          title: "Root",
          count: 1,
          children: [
            {
              id: "child",
              slug: "child",
              title: "Child",
              count: 1,
              forcePricePresence: "without",
              children: [],
            },
          ],
        },
      ],
      "child",
    );

    expect(found?.id).toBe("child");
    expect(found?.forcePricePresence).toBe("without");
  });
});
