import { describe, expect, it } from "vitest";

import {
  filledTranslationsFromDrafts,
  mergeCategoryTranslations,
  translationsFromDrafts,
} from "@/features/categories/domain/category-translations";

const empty = { title: "", slug: "" };

describe("category translations", () => {
  it("copies the first filled locale onto empty ones on create", () => {
    const translations = translationsFromDrafts({
      hy: { title: "Կահույք", slug: "kahuyq" },
      en: empty,
      ru: empty,
    });

    expect(translations).toEqual({
      hy: { title: "Կահույք", slug: "kahuyq" },
      en: { title: "Կահույք", slug: "kahuyq" },
      ru: { title: "Կահույք", slug: "kahuyq" },
    });
  });

  it("returns null when every locale is empty", () => {
    expect(
      translationsFromDrafts({
        hy: empty,
        en: empty,
        ru: empty,
      }),
    ).toBeNull();
  });

  it("omits empty locales when collecting filled drafts", () => {
    expect(
      filledTranslationsFromDrafts({
        hy: { title: "Կահույք", slug: "kahuyq" },
        en: empty,
        ru: empty,
      }),
    ).toEqual({
      hy: { title: "Կահույք", slug: "kahuyq" },
    });
  });

  it("keeps existing locales on edit when a tab is empty", () => {
    const merged = mergeCategoryTranslations(
      {
        hy: { title: "Կահույք", slug: "kahuyq" },
        en: { title: "Furniture", slug: "furniture" },
      },
      {
        hy: { title: "Կահույք նոր", slug: "kahuyq-nor" },
        en: empty,
        ru: empty,
      },
    );

    expect(merged).toEqual({
      hy: { title: "Կահույք նոր", slug: "kahuyq-nor" },
      en: { title: "Furniture", slug: "furniture" },
    });
  });
});
