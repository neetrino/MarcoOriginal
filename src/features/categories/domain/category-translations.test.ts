import { describe, expect, it } from "vitest";

import {
  filledTranslationsFromDrafts,
  mergeCategoryTranslations,
  translationsFromDrafts,
} from "@/features/categories/domain/category-translations";

const empty = { title: "", slug: "", drawerTitle: "" };

describe("category translations", () => {
  it("copies the first filled locale onto empty ones on create", () => {
    const translations = translationsFromDrafts({
      hy: { title: "Կահույք", slug: "furniture", drawerTitle: "Պրոմո" },
      en: empty,
      ru: empty,
    });

    expect(translations).toEqual({
      hy: { title: "Կահույք", slug: "furniture", drawerTitle: "Պրոմո" },
      en: { title: "Կահույք", slug: "furniture", drawerTitle: "Պրոմո" },
      ru: { title: "Կահույք", slug: "furniture", drawerTitle: "Պրոմո" },
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
        hy: { title: "Կահույք", slug: "furniture", drawerTitle: "" },
        en: empty,
        ru: empty,
      }),
    ).toEqual({
      hy: { title: "Կահույք", slug: "furniture" },
    });
  });

  it("keeps existing locales on edit when a tab is empty", () => {
    const merged = mergeCategoryTranslations(
      {
        hy: { title: "Կահույք", slug: "furniture" },
        en: { title: "Furniture", slug: "furniture" },
      },
      {
        hy: {
          title: "Կահույք նոր",
          slug: "furniture",
          drawerTitle: "Նոր առաջարկ",
        },
        en: empty,
        ru: empty,
      },
    );

    expect(merged).toEqual({
      hy: {
        title: "Կահույք նոր",
        slug: "furniture",
        drawerTitle: "Նոր առաջարկ",
      },
      en: { title: "Furniture", slug: "furniture" },
    });
  });

  it("applies the shared English slug to every filled locale", () => {
    expect(
      filledTranslationsFromDrafts({
        hy: { title: "Կահույք", slug: "furniture", drawerTitle: "" },
        en: { title: "Furniture", slug: "furniture", drawerTitle: "" },
        ru: { title: "Мебель", slug: "furniture", drawerTitle: "" },
      }),
    ).toEqual({
      hy: { title: "Կահույք", slug: "furniture" },
      en: { title: "Furniture", slug: "furniture" },
      ru: { title: "Мебель", slug: "furniture" },
    });
  });
});
