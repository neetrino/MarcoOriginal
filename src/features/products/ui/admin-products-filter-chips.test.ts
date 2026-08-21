import { describe, expect, it } from "vitest";

import {
  adminProductsHasActiveFilters,
  buildAdminProductsFilterChips,
  clearedAdminProductsFilters,
} from "@/features/products/ui/admin-products-filter-chips";

const filters = {
  q: "sofa",
  categoryId: "cat-1",
  stock: "in_stock" as const,
  published: "published" as const,
  sort: "created" as const,
  dir: "desc" as const,
  page: 2,
};

const copy = {
  stockIn: "In Stock",
  stockOut: "Out of Stock",
  stockLow: "Low stock",
  published: "Published",
  draft: "Draft",
};

describe("buildAdminProductsFilterChips", () => {
  it("emits chips for category, stock, and published filters", () => {
    const chips = buildAdminProductsFilterChips(
      filters,
      [{ id: "cat-1", title: "Sofas", parentId: null }],
      copy,
    );
    expect(chips.map((chip) => chip.label)).toEqual([
      "Sofas",
      "In Stock",
      "Published",
    ]);
  });
});

describe("adminProductsHasActiveFilters", () => {
  it("treats typed search or a non-default filter as active", () => {
    expect(adminProductsHasActiveFilters({ ...filters, q: undefined }, "")).toBe(
      true,
    );
    expect(
      adminProductsHasActiveFilters(
        {
          stock: "all",
          published: "all",
          sort: "created",
          dir: "desc",
          page: 1,
        },
        "table",
      ),
    ).toBe(true);
  });
});

describe("clearedAdminProductsFilters", () => {
  it("resets list filters without touching sort", () => {
    expect(clearedAdminProductsFilters()).toEqual({
      q: undefined,
      sku: undefined,
      categoryId: undefined,
      stock: "all",
      published: "all",
      page: 1,
    });
  });
});
