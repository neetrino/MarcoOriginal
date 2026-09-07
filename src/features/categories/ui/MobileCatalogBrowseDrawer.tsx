"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

import type { HeaderCategoryNode } from "@/features/categories/domain/header-category-menu";
import { resolveHeaderCategoryPromo } from "@/features/categories/domain/header-category-promo";
import { MobileCatalogBrowseCards } from "@/features/categories/ui/MobileCatalogBrowseCards";
import { MobileCatalogBrowseSearch } from "@/features/categories/ui/MobileCatalogBrowseSearch";
import { MobileCatalogBrowseSection } from "@/features/categories/ui/MobileCatalogBrowseSection";
import {
  MOBILE_BROWSE_CLOSE_BTN_CLASS,
  MOBILE_BROWSE_CLOSE_WRAP_CLASS,
  MOBILE_BROWSE_OVERLAY_CLASS,
  MOBILE_BROWSE_SCROLL_CLASS,
  MOBILE_BROWSE_SECTIONS_CLASS,
} from "@/features/categories/ui/mobile-catalog-browse.classes";
import { catalogHref } from "@/features/products/domain/catalog-href";
import { EMPTY_CATALOG_SEARCH } from "@/features/products/domain/catalog-search-params";
import { useIsClient } from "@/lib/react/use-is-client";
import type { Locale } from "@/lib/i18n/config";

export type MobileCatalogBrowseCopy = {
  title: string;
  close: string;
  allCategories: string;
  more: string;
  searchPlaceholder: string;
  searchSubmit: string;
};

type MobileCatalogBrowseDrawerProps = {
  open: boolean;
  onClose: () => void;
  locale: Locale;
  categories: readonly HeaderCategoryNode[];
  copy: MobileCatalogBrowseCopy;
};

export function MobileCatalogBrowseDrawer({
  open,
  onClose,
  locale,
  categories,
  copy,
}: MobileCatalogBrowseDrawerProps) {
  const mounted = useIsClient();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) setSelectedId(null);
  }, [open]);

  const visibleSections = useMemo(() => {
    if (selectedId === null) return categories;
    const selected = categories.find((item) => item.id === selectedId);
    return selected ? [selected] : categories;
  }, [categories, selectedId]);

  function hrefFor(slug: string, root?: HeaderCategoryNode): string {
    const rootIsHardware =
      root != null &&
      resolveHeaderCategoryPromo(root.slug, root.title) === "hardware";
    return catalogHref(locale, {
      ...EMPTY_CATALOG_SEARCH,
      categorySlugs: [slug],
      ...(rootIsHardware ? { pricePresence: "without" as const } : {}),
    });
  }

  if (!mounted || !open) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={copy.title}
      className={MOBILE_BROWSE_OVERLAY_CLASS}
    >
      <div className={MOBILE_BROWSE_CLOSE_WRAP_CLASS}>
        <button
          type="button"
          onClick={onClose}
          className={MOBILE_BROWSE_CLOSE_BTN_CLASS}
          aria-label={copy.close}
        >
          <span className="relative size-[13px] overflow-hidden" aria-hidden>
            <Image
              src="/assets/mobile-catalog/icon-close.svg"
              alt=""
              width={13}
              height={13}
              className="size-full"
              unoptimized
            />
          </span>
        </button>
      </div>

      <div className={MOBILE_BROWSE_SCROLL_CLASS} data-mobile-browse-scroll>
        <MobileCatalogBrowseSearch
          action={`/${locale}/products`}
          placeholder={copy.searchPlaceholder}
          submitLabel={copy.searchSubmit}
          onSubmitNavigate={onClose}
        />

        <MobileCatalogBrowseCards
          categories={categories}
          selectedId={selectedId}
          allLabel={copy.allCategories}
          onSelectAll={() => setSelectedId(null)}
          onSelectCategory={setSelectedId}
        />

        {visibleSections.length > 0 ? (
          <div className={MOBILE_BROWSE_SECTIONS_CLASS}>
            {visibleSections.map((category) => (
              <MobileCatalogBrowseSection
                key={category.id}
                category={category}
                hrefFor={(slug) => hrefFor(slug, category)}
                moreLabel={copy.more}
                onNavigate={onClose}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
