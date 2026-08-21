import {
  buildCategoryTree,
  filterCategoryTree,
  type CategoryTreeNode,
} from "@/features/categories/domain/category-tree";

type CategoryOption = {
  id: string;
  title: string;
  parentId: string | null;
};

type BrandOption = {
  id: string;
  title: string;
};

/** Adds or removes an id while preserving selection order. */
export function toggleSelectedId(
  ids: readonly string[],
  id: string,
): string[] {
  return ids.includes(id) ? ids.filter((value) => value !== id) : [...ids, id];
}

/** Categories that match the query, plus ancestors needed to keep the tree. */
export function filterCategoryOptions(
  categories: readonly CategoryOption[],
  query: string,
): CategoryOption[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return [...categories];
  const tree = filterCategoryTree(buildCategoryTree([...categories]), (node) =>
    node.title.toLowerCase().includes(needle),
  );
  return flattenCategoryTree(tree);
}

export function filterBrandOptions(
  brands: readonly BrandOption[],
  query: string,
): BrandOption[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return [...brands];
  return brands.filter((brand) => brand.title.toLowerCase().includes(needle));
}

function flattenCategoryTree(
  nodes: readonly CategoryTreeNode<CategoryOption>[],
): CategoryOption[] {
  const rows: CategoryOption[] = [];
  for (const node of nodes) {
    const { children, ...item } = node;
    rows.push(item);
    rows.push(...flattenCategoryTree(children));
  }
  return rows;
}
