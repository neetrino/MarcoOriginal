import { describe, expect, it } from "vitest";

import { catalogHref } from "@/features/products/domain/catalog-href";
import { parseCatalogSearchParams } from "@/features/products/domain/catalog-search-params";

describe("parseCatalogSearchParams", () => {
  it("returns defaults for empty params", () => {
    expect(parseCatalogSearchParams({})).toEqual({
      page: 1,
      categorySlugs: [],
      brandSlugs: [],
      colorHexes: [],
      minPrice: null,
      maxPrice: null,
    });
  });

  it("parses repeated and comma-separated filter values", () => {
    expect(
      parseCatalogSearchParams({
        category: ["hoods", "ovens,hoods"],
        brand: "lex",
        color: ["#FFCA03", "000000"],
        minPrice: "7",
        maxPrice: "4975",
        page: "2",
      }),
    ).toEqual({
      page: 2,
      categorySlugs: ["hoods", "ovens"],
      brandSlugs: ["lex"],
      colorHexes: ["ffca03", "000000"],
      minPrice: 7,
      maxPrice: 4975,
    });
  });

  it("swaps inverted price bounds and ignores invalid values", () => {
    expect(
      parseCatalogSearchParams({
        minPrice: "90",
        maxPrice: "10",
        color: "red",
        page: "0",
      }),
    ).toEqual({
      page: 1,
      categorySlugs: [],
      brandSlugs: [],
      colorHexes: [],
      minPrice: 10,
      maxPrice: 90,
    });
  });
});

describe("catalogHref", () => {
  it("omits the default page and empty filters", () => {
    expect(
      catalogHref("hy", {
        page: 1,
        categorySlugs: [],
        brandSlugs: [],
        colorHexes: [],
        minPrice: null,
        maxPrice: null,
      }),
    ).toBe("/hy/products");
  });

  it("serializes selected filters", () => {
    expect(
      catalogHref("hy", {
        page: 2,
        categorySlugs: ["hoods"],
        brandSlugs: ["lex"],
        colorHexes: ["000000"],
        minPrice: 7,
        maxPrice: 4975,
      }),
    ).toBe(
      "/hy/products?category=hoods&brand=lex&color=000000&minPrice=7&maxPrice=4975&page=2",
    );
  });
});
