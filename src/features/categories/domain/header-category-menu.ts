export type HeaderCategoryNode = {
  id: string;
  slug: string;
  title: string;
  count: number;
  imageUrl: string | null;
  bannerImageUrl: string | null;
  children: HeaderCategoryNode[];
};

export type HeaderCategoryGroup = {
  parent: HeaderCategoryNode;
  children: HeaderCategoryNode[];
};

/** Collapsed descendant list length before “see all”. */
export const HEADER_CATEGORY_DESCENDANT_PREVIEW = 10;

/** Groups a root’s direct children for the mega-menu content column. */
export function headerCategoryGroups(
  root: HeaderCategoryNode,
): HeaderCategoryGroup[] {
  return root.children.map((child) => ({
    parent: { ...child, children: [] },
    children: child.children,
  }));
}

/** Visible descendants before the “see all” control. */
export function visibleCategoryDescendants(
  categories: readonly HeaderCategoryNode[],
  expanded: boolean,
): HeaderCategoryNode[] {
  if (expanded) return [...categories];
  return categories.slice(0, HEADER_CATEGORY_DESCENDANT_PREVIEW);
}
