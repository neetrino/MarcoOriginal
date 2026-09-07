import { describe, expect, it } from "vitest";

import type { HeaderCategoryNode } from "@/features/categories/domain/header-category-menu";
import {
  mobileCatalogCardImageUrl,
  orderMobileCatalogSections,
  resolveMobileCatalogCardVisual,
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

describe("orderMobileCatalogSections", () => {
  const furniture = node({ id: "f", slug: "kahovyq", title: "Կահույք" });
  const hardware = node({
    id: "h",
    slug: "kahovyqi-patrastman-paraganer",
    title: "Կահույքի պատրաստման պարագաներ",
  });
  const electronics = node({
    id: "e",
    slug: "texnika-ev-elektronika",
    title: "Տեխնիկա և էլեկտրոնիկա",
  });
  const roots = [furniture, hardware, electronics];

  it("keeps original order when All is selected", () => {
    expect(orderMobileCatalogSections(roots, null).map((item) => item.id)).toEqual([
      "f",
      "h",
      "e",
    ]);
  });

  it("pins the selected category to the first section slot", () => {
    expect(orderMobileCatalogSections(roots, "h").map((item) => item.id)).toEqual([
      "h",
      "f",
      "e",
    ]);
  });
});
