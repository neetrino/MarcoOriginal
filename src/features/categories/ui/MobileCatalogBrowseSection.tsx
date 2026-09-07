"use client";

import Image from "next/image";
import { useState } from "react";

import { AppLink } from "@/components/ui/AppLink";
import type { HeaderCategoryNode } from "@/features/categories/domain/header-category-menu";
import {
  flattenMobileCatalogSubcategories,
  MOBILE_CATALOG_SUBCATEGORY_ICON,
  visibleMobileCatalogSubcategories,
} from "@/features/categories/domain/mobile-catalog-card";
import {
  MOBILE_BROWSE_MORE_BTN_CLASS,
  MOBILE_BROWSE_ROW_CLASS,
  MOBILE_BROWSE_ROW_LABEL_CLASS,
  MOBILE_BROWSE_SECTION_CLASS,
  MOBILE_BROWSE_SECTION_LIST_CLASS,
  MOBILE_BROWSE_SECTION_TITLE_CLASS,
} from "@/features/categories/ui/mobile-catalog-browse.classes";

type MobileCatalogBrowseSectionProps = {
  category: HeaderCategoryNode;
  hrefFor: (slug: string) => string;
  moreLabel: string;
  onNavigate: () => void;
};

/**
 * Figma 108:4050 — root title, scrollable real subcategory rows, always-visible “Ավելին”.
 */
export function MobileCatalogBrowseSection({
  category,
  hrefFor,
  moreLabel,
  onNavigate,
}: MobileCatalogBrowseSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const entries = flattenMobileCatalogSubcategories(category);
  const visible = visibleMobileCatalogSubcategories(entries, expanded);
  const hasMore = entries.length > visible.length;
  const headingId = `mobile-browse-section-${category.id}`;
  const categoryHref = hrefFor(category.slug);

  return (
    <section className={MOBILE_BROWSE_SECTION_CLASS} aria-labelledby={headingId}>
      <h2 id={headingId} className={MOBILE_BROWSE_SECTION_TITLE_CLASS}>
        <AppLink
          href={categoryHref}
          prefetchPolicy="none"
          onClick={onNavigate}
          className="hover:opacity-90"
        >
          {category.title}
        </AppLink>
      </h2>

      {visible.length > 0 ? (
        <ul className={MOBILE_BROWSE_SECTION_LIST_CLASS}>
          {visible.map((child) => (
            <li key={child.id}>
              <AppLink
                href={hrefFor(child.slug)}
                prefetchPolicy="none"
                onClick={onNavigate}
                className={MOBILE_BROWSE_ROW_CLASS}
              >
                <span className="flex size-[52px] shrink-0 items-center justify-center p-[7px]">
                  <SubcategoryIcon imageUrl={child.imageUrl} />
                </span>
                <span className={MOBILE_BROWSE_ROW_LABEL_CLASS}>
                  {child.title}
                </span>
              </AppLink>
            </li>
          ))}
        </ul>
      ) : null}

      {hasMore ? (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className={MOBILE_BROWSE_MORE_BTN_CLASS}
        >
          {moreLabel}
        </button>
      ) : (
        <AppLink
          href={categoryHref}
          prefetchPolicy="none"
          onClick={onNavigate}
          className={MOBILE_BROWSE_MORE_BTN_CLASS}
        >
          {moreLabel}
        </AppLink>
      )}
    </section>
  );
}

function SubcategoryIcon({ imageUrl }: { imageUrl: string | null }) {
  const src = imageUrl?.trim() || MOBILE_CATALOG_SUBCATEGORY_ICON;
  return (
    <Image
      src={src}
      alt=""
      width={27}
      height={30}
      className="h-[29px] w-[27px] object-contain"
      unoptimized={src.endsWith(".svg")}
      draggable={false}
    />
  );
}
