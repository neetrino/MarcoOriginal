import { describe, expect, it } from "vitest";

import {
  categoryHasSelectedDescendant,
  collectBrandIdsForSlugs,
  collectCategoryIdsForSlugs,
  type CatalogBrandFacet,
  type CatalogCategoryFacet,
} from "@/features/products/domain/catalog-filters";

const tree: CatalogCategoryFacet[] = [
  {
    id: "kitchen",
    slug: "kitchen",
    title: "Kitchen",
    count: 10,
    children: [
      {
        id: "hoods",
        slug: "hoods",
        title: "Hoods",
        count: 4,
        children: [],
      },
    ],
  },
];

describe("collectCategoryIdsForSlugs", () => {
  it("includes descendants when a parent slug is selected", () => {
    expect(collectCategoryIdsForSlugs(tree, ["kitchen"])).toEqual([
      "kitchen",
      "hoods",
    ]);
  });

  it("selects a child without the parent", () => {
    expect(collectCategoryIdsForSlugs(tree, ["hoods"])).toEqual(["hoods"]);
  });
});

describe("collectBrandIdsForSlugs", () => {
  const brands: CatalogBrandFacet[] = [
    { id: "b1", slug: "lex", title: "Lex" },
    { id: "b2", slug: "aux", title: "AUX" },
  ];

  it("maps selected slugs to brand ids", () => {
    expect(collectBrandIdsForSlugs(brands, ["aux"])).toEqual(["b2"]);
  });
});

describe("categoryHasSelectedDescendant", () => {
  it("detects a selected nested slug", () => {
    expect(categoryHasSelectedDescendant(tree[0]!, new Set(["hoods"]))).toBe(
      true,
    );
    expect(categoryHasSelectedDescendant(tree[0]!, new Set(["other"]))).toBe(
      false,
    );
  });
});
