import { describe, expect, it } from "vitest";

import {
  MAX_COMPARE_PRODUCTS,
  parseCompareProductIds,
  removeCompareProductId,
  serializeCompareProductIds,
  toggleCompareProductId,
} from "@/features/compare/domain/compare-list";

const ID_A = "01900000-0000-7000-8000-000000000001";
const ID_B = "01900000-0000-7000-8000-000000000002";
const ID_C = "01900000-0000-7000-8000-000000000003";
const ID_D = "01900000-0000-7000-8000-000000000004";
const ID_E = "01900000-0000-7000-8000-000000000005";

describe("parseCompareProductIds", () => {
  it("returns an empty list for missing or invalid payloads", () => {
    expect(parseCompareProductIds(undefined)).toEqual([]);
    expect(parseCompareProductIds("")).toEqual([]);
    expect(parseCompareProductIds("not-json")).toEqual([]);
    expect(parseCompareProductIds('{"id":1}')).toEqual([]);
  });

  it("keeps unique valid ids and drops the rest", () => {
    expect(
      parseCompareProductIds(JSON.stringify([ID_A, "nope", ID_A, ID_B])),
    ).toEqual([ID_A, ID_B]);
  });

  it("caps the list at the compare maximum", () => {
    expect(
      parseCompareProductIds(JSON.stringify([ID_A, ID_B, ID_C, ID_D, ID_E])),
    ).toHaveLength(MAX_COMPARE_PRODUCTS);
  });
});

describe("toggleCompareProductId", () => {
  it("adds a product when under the limit", () => {
    expect(toggleCompareProductId([ID_A], ID_B)).toEqual({
      ids: [ID_A, ID_B],
      inCompare: true,
      status: "added",
    });
  });

  it("removes a product that is already listed", () => {
    expect(toggleCompareProductId([ID_A, ID_B], ID_A)).toEqual({
      ids: [ID_B],
      inCompare: false,
      status: "removed",
    });
  });

  it("rejects a fifth product", () => {
    expect(toggleCompareProductId([ID_A, ID_B, ID_C, ID_D], ID_E)).toEqual({
      ids: [ID_A, ID_B, ID_C, ID_D],
      inCompare: false,
      status: "limit",
    });
  });
});

describe("removeCompareProductId", () => {
  it("removes by id and serializes a bounded payload", () => {
    expect(removeCompareProductId([ID_A, ID_B], ID_A)).toEqual([ID_B]);
    expect(serializeCompareProductIds([ID_A, ID_B, ID_C, ID_D, ID_E])).toBe(
      JSON.stringify([ID_A, ID_B, ID_C, ID_D]),
    );
  });
});
