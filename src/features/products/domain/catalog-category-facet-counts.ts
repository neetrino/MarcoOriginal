import {
  buildCategoryTreeWithDistinctProductCounts,
  type CategoryDistinctCountNode,
} from "@/features/categories/domain/category-distinct-product-counts";
import type {
  CategoryLink,
  CategoryTreeNode,
} from "@/features/categories/domain/category-tree";
import type { CatalogCategoryFacet } from "@/features/products/domain/catalog-filters";
import type { CatalogPricePresence } from "@/features/products/domain/catalog-sort";

type CategoryFacetSource = CategoryLink & {
  title: string;
  slug: string;
};

/**
 * Builds storefront category facets where each `count` is the number of
 * distinct products linked to that category or any descendant.
 */
export function buildCategoryFacetsWithDistinctCounts(
  nodes: readonly CategoryTreeNode<CategoryFacetSource>[],
  productIdsByCategoryId: ReadonlyMap<string, ReadonlySet<string>>,
): CatalogCategoryFacet[] {
  return buildCategoryTreeWithDistinctProductCounts(
    nodes,
    productIdsByCategoryId,
  ).map(toFacet);
}

/** Drops category nodes with no matching products in the current listing mode. */
export function pruneEmptyCategoryFacets(
  nodes: readonly CatalogCategoryFacet[],
): CatalogCategoryFacet[] {
  const pruned: CatalogCategoryFacet[] = [];
  for (const node of nodes) {
    const children = pruneEmptyCategoryFacets(node.children);
    if (node.count <= 0 && children.length === 0) continue;
    pruned.push({ ...node, children });
  }
  return pruned;
}

/**
 * Keeps categories that have products in either priced or unpriced mode.
 * Display `count` prefers the active mode; when that is 0, shows the other
 * mode's count and sets `forcePricePresence` so selection can switch modes.
 */
export function mergeCategoryFacetsByPricePresence(
  activeFacets: readonly CatalogCategoryFacet[],
  alternateFacets: readonly CatalogCategoryFacet[],
  alternatePresence: CatalogPricePresence,
): CatalogCategoryFacet[] {
  const alternateById = indexFacetsById(alternateFacets);
  const activeIds = new Set(activeFacets.map((node) => node.id));
  const merged: CatalogCategoryFacet[] = [];

  for (const active of activeFacets) {
    const node = mergeFacetNode(
      active,
      alternateById.get(active.id) ?? null,
      alternatePresence,
    );
    if (node) merged.push(node);
  }

  for (const alternate of alternateFacets) {
    if (activeIds.has(alternate.id)) continue;
    const node = mergeFacetNode(null, alternate, alternatePresence);
    if (node) merged.push(node);
  }

  return merged;
}

/** Finds a category facet by locale slug anywhere in the tree. */
export function findCategoryFacetBySlug(
  nodes: readonly CatalogCategoryFacet[],
  slug: string,
): CatalogCategoryFacet | null {
  for (const node of nodes) {
    if (node.slug === slug) return node;
    const nested = findCategoryFacetBySlug(node.children, slug);
    if (nested) return nested;
  }
  return null;
}

function mergeFacetNode(
  active: CatalogCategoryFacet | null,
  alternate: CatalogCategoryFacet | null,
  alternatePresence: CatalogPricePresence,
): CatalogCategoryFacet | null {
  if (!active && !alternate) return null;

  const base = active ?? alternate;
  if (!base) return null;

  const activeChildren = active?.children ?? [];
  const alternateChildren = alternate?.children ?? [];
  const alternateChildrenById = indexFacetsById(alternateChildren);
  const activeChildIds = new Set(activeChildren.map((child) => child.id));

  const children: CatalogCategoryFacet[] = [];
  for (const child of activeChildren) {
    const mergedChild = mergeFacetNode(
      child,
      alternateChildrenById.get(child.id) ?? null,
      alternatePresence,
    );
    if (mergedChild) children.push(mergedChild);
  }
  for (const child of alternateChildren) {
    if (activeChildIds.has(child.id)) continue;
    const mergedChild = mergeFacetNode(null, child, alternatePresence);
    if (mergedChild) children.push(mergedChild);
  }

  const activeCount = active?.count ?? 0;
  const alternateCount = alternate?.count ?? 0;
  if (activeCount <= 0 && alternateCount <= 0 && children.length === 0) {
    return null;
  }

  const usesAlternate = activeCount <= 0 && alternateCount > 0;
  return {
    id: base.id,
    slug: base.slug,
    title: base.title,
    count: usesAlternate ? alternateCount : activeCount,
    children,
    ...(usesAlternate ? { forcePricePresence: alternatePresence } : {}),
  };
}

function indexFacetsById(
  nodes: readonly CatalogCategoryFacet[],
): Map<string, CatalogCategoryFacet> {
  return new Map(nodes.map((node) => [node.id, node]));
}

function toFacet(node: CategoryDistinctCountNode): CatalogCategoryFacet {
  return {
    id: node.id,
    slug: node.slug,
    title: node.title,
    count: node.count,
    children: node.children.map(toFacet),
  };
}
