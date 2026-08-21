import { describe, expect, it } from "vitest";

import {
  adminProductsHref,
  adminProductsSortHref,
  buildAdminProductsQuery,
  nextAdminProductsSort,
} from "@/features/products/domain/admin-products-query";

const base = {
  stock: "all" as const,
  published: "all" as const,
  sort: "created" as const,
  dir: "desc" as const,
  page: 1,
};

describe("buildAdminProductsQuery", () => {
  it("omits default filter values", () => {
    expect(buildAdminProductsQuery(base)).toBe("");
  });

  it("keeps only active filters and resets page on override", () => {
    expect(
      buildAdminProductsQuery(
        { ...base, q: "sofa", stock: "in_stock", page: 3 },
        { published: "published", page: 1 },
      ),
    ).toBe("q=sofa&stock=in_stock&published=published");
  });
});

describe("adminProductsHref", () => {
  it("returns the bare path when the query is empty", () => {
    expect(adminProductsHref("hy", base)).toBe("/hy/admin/products");
  });
});

describe("nextAdminProductsSort", () => {
  it("starts ascending on a new column and flips the active one", () => {
    expect(nextAdminProductsSort(base, "title")).toEqual({
      sort: "title",
      dir: "asc",
      page: 1,
    });
    expect(
      nextAdminProductsSort({ ...base, sort: "title", dir: "asc" }, "title"),
    ).toEqual({ sort: "title", dir: "desc", page: 1 });
  });
});

describe("adminProductsSortHref", () => {
  it("encodes the next sort in the list URL", () => {
    expect(adminProductsSortHref("en", base, "price")).toBe(
      "/en/admin/products?sort=price&dir=asc",
    );
  });
});
