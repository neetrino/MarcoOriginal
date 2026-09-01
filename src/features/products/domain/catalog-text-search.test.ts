import { describe, expect, it } from "vitest";

import {
  CATALOG_SEARCH_QUERY_MAX_LENGTH,
  escapeIlikeLiteral,
  normalizeCatalogSearchQuery,
  toIlikeContainsPattern,
} from "@/features/products/domain/catalog-text-search";

describe("normalizeCatalogSearchQuery", () => {
  it("returns null for empty or whitespace input", () => {
    expect(normalizeCatalogSearchQuery(undefined)).toBeNull();
    expect(normalizeCatalogSearchQuery(null)).toBeNull();
    expect(normalizeCatalogSearchQuery("")).toBeNull();
    expect(normalizeCatalogSearchQuery("   ")).toBeNull();
  });

  it("trims and truncates to the max length", () => {
    expect(normalizeCatalogSearchQuery("  sofa  ")).toBe("sofa");
    const long = "a".repeat(CATALOG_SEARCH_QUERY_MAX_LENGTH + 20);
    expect(normalizeCatalogSearchQuery(long)).toBe(
      "a".repeat(CATALOG_SEARCH_QUERY_MAX_LENGTH),
    );
  });
});

describe("escapeIlikeLiteral / toIlikeContainsPattern", () => {
  it("escapes wildcard and backslash characters", () => {
    expect(escapeIlikeLiteral(`100%_off\\`)).toBe(`100\\%\\_off\\\\`);
    expect(toIlikeContainsPattern("a%b")).toBe(`%a\\%b%`);
  });
});
