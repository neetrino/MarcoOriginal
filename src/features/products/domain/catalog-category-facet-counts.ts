import {
  buildCategoryTreeWithDistinctProductCounts,
  type CategoryDistinctCountNode,
} from "@/features/categories/domain/category-distinct-product-counts";
import type {
  CategoryLink,
  CategoryTreeNode,
} from "@/features/categories/domain/category-tree";
import type { CatalogCategoryFacet } from "@/features/products/domain/catalog-filters";

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

function toFacet(node: CategoryDistinctCountNode): CatalogCategoryFacet {
  return {
    id: node.id,
    slug: node.slug,
    title: node.title,
    count: node.count,
    children: node.children.map(toFacet),
  };
}
