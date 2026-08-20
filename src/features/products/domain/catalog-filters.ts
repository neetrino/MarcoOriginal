export type CatalogCategoryFacet = {
  id: string;
  slug: string;
  title: string;
  count: number;
  children: CatalogCategoryFacet[];
};

export type CatalogBrandFacet = {
  id: string;
  slug: string;
  title: string;
};

export type CatalogColorFacet = {
  id: string;
  hex: string;
};

export type CatalogFacets = {
  categories: CatalogCategoryFacet[];
  brands: CatalogBrandFacet[];
  colors: CatalogColorFacet[];
  minPriceAmd: number | null;
  maxPriceAmd: number | null;
};

function collectSubtreeIds(node: CatalogCategoryFacet): string[] {
  const ids = [node.id];
  for (const child of node.children) {
    ids.push(...collectSubtreeIds(child));
  }
  return ids;
}

/** Category ids (including descendants) matching selected locale slugs. */
export function collectCategoryIdsForSlugs(
  nodes: readonly CatalogCategoryFacet[],
  slugs: readonly string[],
): string[] {
  if (slugs.length === 0) return [];
  const wanted = new Set(slugs);
  const ids = new Set<string>();

  function walk(node: CatalogCategoryFacet): void {
    if (wanted.has(node.slug)) {
      for (const id of collectSubtreeIds(node)) {
        ids.add(id);
      }
    }
    for (const child of node.children) {
      walk(child);
    }
  }

  for (const node of nodes) {
    walk(node);
  }
  return [...ids];
}

/** True when a node or any descendant slug is selected. */
export function categoryHasSelectedDescendant(
  node: CatalogCategoryFacet,
  slugs: ReadonlySet<string>,
): boolean {
  if (slugs.has(node.slug)) return true;
  return node.children.some((child) =>
    categoryHasSelectedDescendant(child, slugs),
  );
}
