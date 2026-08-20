import { describe, expect, it } from "vitest";

import {
  generateBrandSku,
  slugifyBrandTitle,
} from "@/features/brands/domain/brand-identity";

describe("brand identity helpers", () => {
  it("generates an uppercase SKU from the title", () => {
    expect(generateBrandSku("Calvin Klein")).toBe("CALVIN-KLEIN");
    expect(generateBrandSku("  Nike  ")).toBe("NIKE");
  });

  it("falls back when the title has no letters or numbers", () => {
    expect(generateBrandSku("***")).toBe("BRAND");
    expect(slugifyBrandTitle("***")).toBe("brand");
  });

  it("builds a lowercase slug from the title", () => {
    expect(slugifyBrandTitle("Calvin Klein")).toBe("calvin-klein");
  });
});
