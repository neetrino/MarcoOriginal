import { describe, expect, it } from "vitest";

import { generateAttributeKey } from "@/features/attributes/domain/attribute-key";

describe("generateAttributeKey", () => {
  it("lowercases the name and strips spaces", () => {
    expect(generateAttributeKey("Color")).toBe("color");
    expect(generateAttributeKey("  Size Chart  ")).toBe("sizechart");
  });

  it("keeps unicode letters", () => {
    expect(generateAttributeKey("Գույն")).toBe("գույն");
  });

  it("falls back when the name has no letters or numbers", () => {
    expect(generateAttributeKey("***")).toBe("attribute");
  });
});
