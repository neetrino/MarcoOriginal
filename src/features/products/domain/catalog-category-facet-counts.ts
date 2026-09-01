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
  return nodes.map((node) => toFacet(node, productIdsByCategoryId).facet);
}

function toFacet(
  node: CategoryTreeNode<CategoryFacetSource>,
  productIdsByCategoryId: ReadonlyMap<string, ReadonlySet<string>>,
): { facet: CatalogCategoryFacet; productIds: Set<string> } {
  const childResults = node.children.map((child) =>
    toFacet(child, productIdsByCategoryId),
  );
  const productIds = new Set(productIdsByCategoryId.get(node.id) ?? []);
  for (const child of childResults) {
    for (const productId of child.productIds) {
      productIds.add(productId);
    }
  }
  return {
    productIds,
    facet: {
      id: node.id,
      slug: node.slug,
      title: node.title,
      count: productIds.size,
      children: childResults.map((child) => child.facet),
    },
  };
}
