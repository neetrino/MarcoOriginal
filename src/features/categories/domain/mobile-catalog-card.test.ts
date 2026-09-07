import { describe, expect, it } from "vitest";

import type { HeaderCategoryNode } from "@/features/categories/domain/header-category-menu";
import {
  flattenMobileCatalogSubcategories,
  mobileCatalogCardImageUrl,
  resolveMobileCatalogCardVisual,
  visibleMobileCatalogSubcategories,
} from "@/features/categories/domain/mobile-catalog-card";

function node(
  partial: Partial<HeaderCategoryNode> &
    Pick<HeaderCategoryNode, "id" | "slug" | "title">,
): HeaderCategoryNode {
  return {
    count: 0,
    imageUrl: null,
    bannerImageUrl: null,
    drawerTitle: null,
    children: [],
    ...partial,
  };
}

describe("resolveMobileCatalogCardVisual", () => {
  it("maps furniture and hardware roots", () => {
    expect(resolveMobileCatalogCardVisual("kahovyq", "Կահույք")).toBe(
      "furniture",
    );
    expect(
      resolveMobileCatalogCardVisual(
        "kahovyqi-patrastman-paraganer",
        "Կահույքի պատրաստման պարագաներ",
      ),
    ).toBe("hardware");
  });

  it("maps electronics roots before generic", () => {
    expect(
      resolveMobileCatalogCardVisual(
        "texnika-ev-elektronika",
        "Տեխնիկա և էլեկտրոնիկա",
      ),
    ).toBe("electronics");
  });
});

describe("mobileCatalogCardImageUrl", () => {
  it("prefers uploaded images over static fallbacks", () => {
    expect(
      mobileCatalogCardImageUrl("furniture", "https://cdn.example/custom.webp"),
    ).toBe("https://cdn.example/custom.webp");
    expect(mobileCatalogCardImageUrl("all")).toBe(
      "/assets/mobile-catalog/card-all.webp",
    );
  });
});

describe("flattenMobileCatalogSubcategories", () => {
  it("returns depth-first descendants with real titles", () => {
    const root = node({
      id: "root",
      slug: "kahovyq",
      title: "Կահույք",
      children: [
        node({
          id: "soft",
          slug: "papuk",
          title: "Փափուկ կահույք",
          children: [
            node({ id: "sofa", slug: "bnakaran", title: "Բազմոցներ" }),
          ],
        }),
        node({ id: "bed", slug: "nnj", title: "Ննջասենյակի կահույք" }),
      ],
    });

    expect(
      flattenMobileCatalogSubcategories(root).map((item) => item.title),
    ).toEqual(["Փափուկ կահույք", "Բազմոցներ", "Ննջասենյակի կահույք"]);
  });
});

describe("visibleMobileCatalogSubcategories", () => {
  it("caps collapsed rows and returns all when expanded", () => {
    const entries = Array.from({ length: 10 }, (_, index) =>
      node({
        id: `c-${index}`,
        slug: `c-${index}`,
        title: `Cat ${index}`,
      }),
    );

    expect(visibleMobileCatalogSubcategories(entries, false)).toHaveLength(8);
    expect(visibleMobileCatalogSubcategories(entries, true)).toHaveLength(10);
  });
});
