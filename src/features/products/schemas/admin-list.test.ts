import { describe, expect, it } from "vitest";

import { adminProductsFilterSchema } from "@/features/products/schemas/admin-list";

describe("adminProductsFilterSchema", () => {
  it("defaults stock, published, sort, and page", () => {
    expect(adminProductsFilterSchema.parse({})).toEqual({
      stock: "all",
      published: "all",
      sort: "created",
      dir: "desc",
      page: 1,
    });
  });

  it("accepts a published status filter", () => {
    expect(
      adminProductsFilterSchema.parse({ published: "unpublished", q: "sku-1" }),
    ).toMatchObject({ published: "unpublished", q: "sku-1" });
  });
});
