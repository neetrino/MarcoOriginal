import { describe, expect, it } from "vitest";

import {
  parseProductSpecs,
  slugifyProductTitle,
} from "@/features/products/domain/product-specs";

describe("product specs", () => {
  it("parses title/value rows and drops empty ones", () => {
    expect(
      parseProductSpecs([
        { id: "a", title: "  Չափս  ", value: " M " },
        { title: "   ", value: "" },
        { id: "b", title: "Գործվածք", value: "Բամբակ" },
      ]),
    ).toEqual([
      { id: "a", title: "Չափս", value: "M" },
      { id: "b", title: "Գործվածք", value: "Բամբակ" },
    ]);
  });

  it("slugifies product titles", () => {
    expect(slugifyProductTitle("  White Tee!  ")).toBe("white-tee");
  });
});
