import { describe, expect, it } from "vitest";

import {
  buildBrandFacetsWithCounts,
  findBrandFacetBySlug,
  mergeBrandFacetsByPricePresence,
  resolvePricePresenceForSelectedBrands,
} from "@/features/products/domain/catalog-brand-facet-counts";
import type { CatalogBrandFacet } from "@/features/products/domain/catalog-filters";

describe("buildBrandFacetsWithCounts", () => {
  it("maps distinct product counts per brand", () => {
    const productIdsByBrandId = new Map<string, Set<string>>([
      ["b1", new Set(["p1", "p2"])],
      ["b2", new Set(["p3"])],
    ]);
    expect(
      buildBrandFacetsWithCounts(
        [
          { id: "b1", slug: "lex", title: "Lex" },
          { id: "b2", slug: "aux", title: "AUX" },
          { id: "b3", slug: "empty", title: "Empty" },
        ],
        productIdsByBrandId,
      ),
    ).toEqual([
      { id: "b1", slug: "lex", title: "Lex", count: 2 },
      { id: "b2", slug: "aux", title: "AUX", count: 1 },
      { id: "b3", slug: "empty", title: "Empty", count: 0 },
    ]);
  });
});

describe("mergeBrandFacetsByPricePresence", () => {
  it("keeps alternate-only brands and forces the other price mode", () => {
    const merged = mergeBrandFacetsByPricePresence(
      [{ id: "priced", slug: "priced", title: "Priced", count: 2 }],
      [
        { id: "priced", slug: "priced", title: "Priced", count: 0 },
        { id: "royax", slug: "royax", title: "Royax", count: 3 },
      ],
      "without",
    );

    expect(merged).toEqual([
      { id: "priced", slug: "priced", title: "Priced", count: 2 },
      {
        id: "royax",
        slug: "royax",
        title: "Royax",
        count: 3,
        forcePricePresence: "without",
      },
    ]);
  });

  it("drops brands with no products in either mode", () => {
    const merged = mergeBrandFacetsByPricePresence(
      [{ id: "gone", slug: "gone", title: "Gone", count: 0 }],
      [{ id: "gone", slug: "gone", title: "Gone", count: 0 }],
      "without",
    );
    expect(merged).toEqual([]);
  });
});

describe("resolvePricePresenceForSelectedBrands", () => {
  const brands: CatalogBrandFacet[] = [
    { id: "priced", slug: "priced", title: "Priced", count: 2 },
    {
      id: "royax",
      slug: "royax",
      title: "Royax",
      count: 3,
      forcePricePresence: "without",
    },
  ];

  it("keeps current mode when a selected brand has active-mode products", () => {
    expect(
      resolvePricePresenceForSelectedBrands(brands, ["priced", "royax"], "with"),
    ).toBe("with");
  });

  it("switches when every selected brand only exists in the alternate mode", () => {
    expect(
      resolvePricePresenceForSelectedBrands(brands, ["royax"], "with"),
    ).toBe("without");
  });

  it("keeps current mode when no brands are selected", () => {
    expect(resolvePricePresenceForSelectedBrands(brands, [], "with")).toBe(
      "with",
    );
  });
});

describe("findBrandFacetBySlug", () => {
  it("returns the matching brand facet", () => {
    const brands: CatalogBrandFacet[] = [
      { id: "b1", slug: "lex", title: "Lex", count: 1 },
    ];
    expect(findBrandFacetBySlug(brands, "lex")?.id).toBe("b1");
    expect(findBrandFacetBySlug(brands, "missing")).toBeNull();
  });
});
