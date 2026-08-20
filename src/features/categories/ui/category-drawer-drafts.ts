import type { AdminCategoryListItem } from "@/features/categories/application/list-admin-categories";
import type { CategoryLocaleDrafts } from "@/features/categories/domain/category-translations";
import { slugifyCategoryTitle } from "@/features/categories/domain/slugify";
import { locales, type Locale } from "@/lib/i18n/config";

const emptyDraft = { title: "", slug: "" };

export function emptyCategoryDrafts(): CategoryLocaleDrafts {
  return { hy: emptyDraft, en: emptyDraft, ru: emptyDraft };
}

export function draftsFromCategory(
  category: AdminCategoryListItem | null,
): CategoryLocaleDrafts {
  const next = emptyCategoryDrafts();
  if (!category) return next;
  for (const loc of locales) {
    const copy = category.translations[loc];
    if (!copy) continue;
    next[loc] = { title: copy.title, slug: copy.slug };
  }
  if (!locales.some((loc) => next[loc].title)) {
    next.hy = { title: category.title, slug: category.slug };
  }
  return next;
}

export function withDraftTitle(
  drafts: CategoryLocaleDrafts,
  locale: Locale,
  title: string,
  keepSlug: boolean,
): CategoryLocaleDrafts {
  const current = drafts[locale];
  return {
    ...drafts,
    [locale]: {
      title,
      slug: keepSlug && current.slug ? current.slug : slugifyCategoryTitle(title),
    },
  };
}
