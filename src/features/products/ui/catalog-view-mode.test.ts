import { describe, expect, it } from "vitest";

import {
  catalogGridClassName,
  parseCatalogViewMode,
} from "@/features/products/ui/catalog-view-mode";

describe("catalog view mode", () => {
  it("falls back to the default three-column shop grid", () => {
    expect(parseCatalogViewMode(null)).toBe("grid-2");
    expect(parseCatalogViewMode("wide")).toBe("grid-2");
    expect(parseCatalogViewMode("list")).toBe("list");
  });

  it("maps list, default grid, and dense grid to distinct column classes", () => {
    expect(catalogGridClassName("list")).toContain("grid-cols-1");
    expect(catalogGridClassName("grid-2")).toContain("md:grid-cols-3");
    expect(catalogGridClassName("grid-2")).not.toContain("lg:grid-cols-4");
    expect(catalogGridClassName("grid-3")).toContain("lg:grid-cols-4");
  });
});
