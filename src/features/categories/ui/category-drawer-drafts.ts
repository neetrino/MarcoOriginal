import type { AdminCategoryListItem } from "@/features/categories/application/list-admin-categories";
import type { CategoryLocaleDrafts } from "@/features/categories/domain/category-translations";
import { slugifyCategoryTitle } from "@/features/categories/domain/slugify";
import { locales, type Locale } from "@/lib/i18n/config";

const emptyDraft = { title: "", slug: "", drawerTitle: "" };

export function emptyCategoryDrafts(): CategoryLocaleDrafts {
  return { hy: emptyDraft, en: emptyDraft, ru: emptyDraft };
}

/** Shared URL slug across locales; prefers English. */
export function sharedCategorySlug(drafts: CategoryLocaleDrafts): string {
  const enSlug = drafts.en.slug.trim();
  if (enSlug) return enSlug;
  for (const loc of locales) {
    const slug = drafts[loc].slug.trim();
    if (slug) return slug;
  }
  return "";
}

function withSharedSlug(
  drafts: CategoryLocaleDrafts,
  slug: string,
): CategoryLocaleDrafts {
  const next = { ...drafts };
  for (const loc of locales) {
    next[loc] = { ...next[loc], slug };
  }
  return next;
}

export function draftsFromCategory(
  category: AdminCategoryListItem | null,
): CategoryLocaleDrafts {
  const next = emptyCategoryDrafts();
  if (!category) return next;
  for (const loc of locales) {
    const copy = category.translations[loc];
    if (!copy) continue;
    next[loc] = {
      title: copy.title,
      slug: copy.slug,
      drawerTitle: copy.drawerTitle ?? "",
    };
  }
  if (!locales.some((loc) => next[loc].title)) {
    next.hy = {
      title: category.title,
      slug: category.slug,
      drawerTitle: "",
    };
  }
  return withSharedSlug(next, sharedCategorySlug(next) || category.slug);
}

export function withDraftTitle(
  drafts: CategoryLocaleDrafts,
  locale: Locale,
  title: string,
  keepSlug: boolean,
): CategoryLocaleDrafts {
  const withTitle: CategoryLocaleDrafts = {
    ...drafts,
    [locale]: { ...drafts[locale], title },
  };

  if (keepSlug) {
    const slug = sharedCategorySlug(drafts);
    return slug ? withSharedSlug(withTitle, slug) : withTitle;
  }

  const enTitle = (locale === "en" ? title : drafts.en.title).trim();
  const sourceTitle = enTitle || title.trim();
  return withSharedSlug(withTitle, slugifyCategoryTitle(sourceTitle));
}

export function withDraftSlug(
  drafts: CategoryLocaleDrafts,
  slug: string,
): CategoryLocaleDrafts {
  return withSharedSlug(drafts, slug);
}

export function withDraftDrawerTitle(
  drafts: CategoryLocaleDrafts,
  locale: Locale,
  drawerTitle: string,
): CategoryLocaleDrafts {
  return {
    ...drafts,
    [locale]: { ...drafts[locale], drawerTitle },
  };
}
