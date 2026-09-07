"use client";

import Image from "next/image";

import type { HeaderCategoryNode } from "@/features/categories/domain/header-category-menu";
import {
  mobileCatalogCardImageUrl,
  resolveMobileCatalogCardVisual,
} from "@/features/categories/domain/mobile-catalog-card";
import {
  MOBILE_BROWSE_CARD_CLASS,
  MOBILE_BROWSE_CARD_GRID_CLASS,
  MOBILE_BROWSE_CARD_IMAGE_WRAP_CLASS,
  MOBILE_BROWSE_CARD_TITLE_CLASS,
  mobileBrowseCardSurfaceClass,
} from "@/features/categories/ui/mobile-catalog-browse.classes";

type MobileCatalogBrowseCardsProps = {
  categories: readonly HeaderCategoryNode[];
  selectedId: string | null;
  allLabel: string;
  onSelectAll: () => void;
  onSelectCategory: (id: string) => void;
};

export function MobileCatalogBrowseCards({
  categories,
  selectedId,
  allLabel,
  onSelectAll,
  onSelectCategory,
}: MobileCatalogBrowseCardsProps) {
  return (
    <div className={MOBILE_BROWSE_CARD_GRID_CLASS} role="list">
      <CategoryCard
        title={allLabel}
        selected={selectedId === null}
        imageUrl={mobileCatalogCardImageUrl("all")}
        onSelect={onSelectAll}
      />
      {categories.map((category) => {
        const visual = resolveMobileCatalogCardVisual(
          category.slug,
          category.title,
        );
        return (
          <CategoryCard
            key={category.id}
            title={category.title}
            selected={selectedId === category.id}
            imageUrl={mobileCatalogCardImageUrl(
              visual,
              category.bannerImageUrl ?? category.imageUrl,
            )}
            onSelect={() => onSelectCategory(category.id)}
          />
        );
      })}
    </div>
  );
}

function CategoryCard({
  title,
  selected,
  imageUrl,
  onSelect,
}: {
  title: string;
  selected: boolean;
  imageUrl: string | null;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="listitem"
      onClick={onSelect}
      aria-pressed={selected}
      className={`${MOBILE_BROWSE_CARD_CLASS} ${mobileBrowseCardSurfaceClass(selected)}`}
    >
      <span className={MOBILE_BROWSE_CARD_TITLE_CLASS}>{title}</span>
      {imageUrl ? (
        <span className={MOBILE_BROWSE_CARD_IMAGE_WRAP_CLASS} aria-hidden>
          <Image
            src={imageUrl}
            alt=""
            fill
            sizes="180px"
            className="object-contain object-bottom"
            draggable={false}
          />
        </span>
      ) : null}
    </button>
  );
}
