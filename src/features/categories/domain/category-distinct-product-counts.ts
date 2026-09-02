import type {
  CategoryLink,
  CategoryTreeNode,
} from "@/features/categories/domain/category-tree";

type CountableCategory = CategoryLink & {
  title: string;
  slug: string;
};

export type CategoryDistinctCountNode = {
  id: string;
  slug: string;
  title: string;
  count: number;
  children: CategoryDistinctCountNode[];
};

/**
 * Builds a category tree where each `count` is the number of distinct products
 * linked to that category or any descendant (set union, not a sum of children).
 */
export function buildCategoryTreeWithDistinctProductCounts(
  nodes: readonly CategoryTreeNode<CountableCategory>[],
  productIdsByCategoryId: ReadonlyMap<string, ReadonlySet<string>>,
): CategoryDistinctCountNode[] {
  return nodes.map(
    (node) => toCountNode(node, productIdsByCategoryId).node,
  );
}

function toCountNode(
  node: CategoryTreeNode<CountableCategory>,
  productIdsByCategoryId: ReadonlyMap<string, ReadonlySet<string>>,
): { node: CategoryDistinctCountNode; productIds: Set<string> } {
  const childResults = node.children.map((child) =>
    toCountNode(child, productIdsByCategoryId),
  );
  const productIds = new Set(productIdsByCategoryId.get(node.id) ?? []);
  for (const child of childResults) {
    for (const productId of child.productIds) {
      productIds.add(productId);
    }
  }
  return {
    productIds,
    node: {
      id: node.id,
      slug: node.slug,
      title: node.title,
      count: productIds.size,
      children: childResults.map((child) => child.node),
    },
  };
}
