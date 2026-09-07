import {
  resolveHeaderCategoryPromo,
  type HeaderCategoryPromoKey,
} from "@/features/categories/domain/header-category-promo";
import type { HeaderCategoryNode } from "@/features/categories/domain/header-category-menu";

/** Visible subcategory rows before the “More” control (Figma list height). */
export const MOBILE_CATALOG_SUBCATEGORY_PREVIEW = 8;

export const MOBILE_CATALOG_CARD_IMAGES = {
  all: "/assets/mobile-catalog/card-all.webp",
  furniture: "/assets/mobile-catalog/card-furniture.webp",
  hardware: "/assets/mobile-catalog/card-hardware.webp",
  electronics: "/assets/mobile-catalog/card-electronics.webp",
} as const;

export const MOBILE_CATALOG_SUBCATEGORY_ICON =
  "/assets/mobile-catalog/subcategory-icon.svg";

export type MobileCatalogCardVisual =
  | "all"
  | Exclude<HeaderCategoryPromoKey, "generic">
  | "electronics"
  | "generic";

const ELECTRONICS_SLUG_ALIASES = [
  "texnika-ev-elektronika",
  "texnika",
  "elektronika",
  "electronics",
  "appliances",
  "tehnika",
  "bytovaya-tehnika",
  "տեխնիկա-և-էլեկտրոնիկա",
  "տեխնիկա",
  "էլեկտրոնիկա",
] as const;

const ELECTRONICS_TITLE_ALIASES = [
  "տեխնիկա",
  "էլեկտրոնիկա",
  "electronics",
  "appliances",
  "техника",
  "электроника",
] as const;

function matchesAlias(value: string, aliases: readonly string[]): boolean {
  return aliases.some(
    (alias) => value === alias || value.includes(alias) || value.startsWith(`${alias}-`),
  );
}

/**
 * Depth-first list of every nested subcategory under a root
 * (excludes the root itself). Used by the mobile browse section rows.
 */
export function flattenMobileCatalogSubcategories(
  root: HeaderCategoryNode,
): HeaderCategoryNode[] {
  const rows: HeaderCategoryNode[] = [];

  function walk(nodes: readonly HeaderCategoryNode[]): void {
    for (const node of nodes) {
      rows.push(node);
      if (node.children.length > 0) {
        walk(node.children);
      }
    }
  }

  walk(root.children);
  return rows;
}

/** Rows shown before tapping “More”; expanded lists return the full set. */
export function visibleMobileCatalogSubcategories(
  entries: readonly HeaderCategoryNode[],
  expanded: boolean,
): HeaderCategoryNode[] {
  if (expanded) return [...entries];
  return entries.slice(0, MOBILE_CATALOG_SUBCATEGORY_PREVIEW);
}

/**
 * Resolves the mobile browse card visual for a root category.
 * Electronics is checked before the shared furniture/hardware promo map.
 */
export function resolveMobileCatalogCardVisual(
  slug: string,
  title = "",
): MobileCatalogCardVisual {
  const normalizedSlug = slug.trim().toLowerCase();
  const normalizedTitle = title.trim().toLowerCase();
  if (
    matchesAlias(normalizedSlug, ELECTRONICS_SLUG_ALIASES) ||
    matchesAlias(normalizedTitle, ELECTRONICS_TITLE_ALIASES)
  ) {
    return "electronics";
  }

  const promo = resolveHeaderCategoryPromo(slug, title);
  if (promo === "furniture" || promo === "hardware") return promo;
  return "generic";
}

/** Card artwork: admin upload first, then Figma static fallbacks. */
export function mobileCatalogCardImageUrl(
  visual: MobileCatalogCardVisual,
  uploadedUrl?: string | null,
): string | null {
  if (uploadedUrl && uploadedUrl.trim() !== "") return uploadedUrl;
  if (visual === "all") return MOBILE_CATALOG_CARD_IMAGES.all;
  if (visual === "furniture") return MOBILE_CATALOG_CARD_IMAGES.furniture;
  if (visual === "hardware") return MOBILE_CATALOG_CARD_IMAGES.hardware;
  if (visual === "electronics") return MOBILE_CATALOG_CARD_IMAGES.electronics;
  return null;
}
