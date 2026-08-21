import { describe, expect, it } from "vitest";

import {
  filterBrandOptions,
  filterCategoryOptions,
  toggleSelectedId,
} from "@/features/products/domain/product-drawer-catalog-filter";

const categories = [
  { id: "furniture", title: "Furniture", parentId: null },
  { id: "sofas", title: "Sofas", parentId: "furniture" },
  { id: "tech", title: "Technology", parentId: null },
];

describe("toggleSelectedId", () => {
  it("appends a missing id and removes an existing one", () => {
    expect(toggleSelectedId(["a"], "b")).toEqual(["a", "b"]);
    expect(toggleSelectedId(["a", "b"], "a")).toEqual(["b"]);
  });
});

describe("filterCategoryOptions", () => {
  it("keeps the ancestor when a child title matches", () => {
    expect(filterCategoryOptions(categories, "sofa")).toEqual([
      { id: "furniture", title: "Furniture", parentId: null },
      { id: "sofas", title: "Sofas", parentId: "furniture" },
    ]);
  });
});

describe("filterBrandOptions", () => {
  it("filters brands by title", () => {
    const brands = [
      { id: "1", title: "GRATEZ" },
      { id: "2", title: "AUX" },
    ];
    expect(filterBrandOptions(brands, "aux")).toEqual([
      { id: "2", title: "AUX" },
    ]);
  });
});
