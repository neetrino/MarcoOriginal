import { describe, expect, it } from "vitest";

import {
  headerCategoryPromoImageUrl,
  headerCategoryPromoText,
  resolveHeaderCategoryPromo,
  type HeaderCategoryPromoCopy,
} from "@/features/categories/domain/header-category-promo";

const copy: HeaderCategoryPromoCopy = {
  badge: "Limited offer",
  cta: "SHOP NOW",
  furnitureHeadline: "Furniture headline",
  furnitureSubline: "Furniture subline",
  hardwareHeadline: "Hardware headline",
  hardwareSubline: "Hardware subline",
  genericHeadline: "Generic headline",
  genericSubline: "Generic subline",
};

describe("resolveHeaderCategoryPromo", () => {
  it("maps furniture slugs", () => {
    expect(resolveHeaderCategoryPromo("kahovyq")).toBe("furniture");
    expect(resolveHeaderCategoryPromo("կահույք")).toBe("furniture");
  });

  it("maps furniture by localized title when the slug is unrelated", () => {
    expect(resolveHeaderCategoryPromo("ցսցսդցսդցսդց", "Կահույք")).toBe(
      "furniture",
    );
  });

  it("maps hardware slugs that share a furniture prefix", () => {
    expect(
      resolveHeaderCategoryPromo("kahovyqi-patrastman-paraganer-3"),
    ).toBe("hardware");
    expect(
      resolveHeaderCategoryPromo("կահույքի-պատրաստման-պարագաներ"),
    ).toBe("hardware");
    expect(
      resolveHeaderCategoryPromo("կահույքի-պատրաստման-համար-պարականեր"),
    ).toBe("hardware");
  });

  it("maps hardware by title before a furniture title substring", () => {
    expect(
      resolveHeaderCategoryPromo(
        "random-slug",
        "Կահույքի պատրաստման համար պարականեր",
      ),
    ).toBe("hardware");
  });

  it("uses generic copy for every other root category", () => {
    expect(resolveHeaderCategoryPromo("unknown-root")).toBe("generic");
    expect(
      resolveHeaderCategoryPromo(
        "tekhnika-ev-elektronika",
        "Տեխնիկա և Էլեկտրոնիկա",
      ),
    ).toBe("generic");
  });
});

describe("headerCategoryPromoText", () => {
  it("returns furniture, hardware, or generic copy", () => {
    expect(headerCategoryPromoText("furniture", copy).headline).toBe(
      "Furniture headline",
    );
    expect(headerCategoryPromoText("hardware", copy).headline).toBe(
      "Hardware headline",
    );
    expect(headerCategoryPromoText("generic", copy).headline).toBe(
      "Generic headline",
    );
  });
});

describe("headerCategoryPromoImageUrl", () => {
  it("returns distinct static assets for furniture and hardware", () => {
    expect(headerCategoryPromoImageUrl("furniture")).toContain("promo-furniture");
    expect(headerCategoryPromoImageUrl("hardware")).toContain("promo-hardware");
    expect(headerCategoryPromoImageUrl("generic")).toBeNull();
  });

  it("prefers an admin-uploaded category banner over the static fallback", () => {
    expect(
      headerCategoryPromoImageUrl("furniture", "https://cdn.example/banner.webp"),
    ).toBe("https://cdn.example/banner.webp");
    expect(
      headerCategoryPromoImageUrl("generic", "https://cdn.example/tech.webp"),
    ).toBe("https://cdn.example/tech.webp");
    expect(headerCategoryPromoImageUrl("hardware", "   ")).toContain(
      "promo-hardware",
    );
  });
});
