import { describe, expect, it } from "vitest";

import { matchBrandTitle } from "@/features/compare/domain/match-brand-title";

describe("matchBrandTitle", () => {
  it("returns the longest brand title found in the product name", () => {
    expect(
      matchBrandTitle("Օդաքարշ LEX HOGAN 500 Black", ["Hausberg", "LEX"]),
    ).toBe("LEX");
  });

  it("prefers the longer overlapping brand", () => {
    expect(matchBrandTitle("Sony SonyX headphones", ["Sony", "SonyX"])).toBe(
      "SonyX",
    );
  });

  it("returns null when nothing matches", () => {
    expect(matchBrandTitle("Kitchen hood", ["LEX", "Hausberg"])).toBeNull();
  });
});
