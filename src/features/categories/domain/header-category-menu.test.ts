import { describe, expect, it } from "vitest";

import {
  HEADER_CATEGORY_DESCENDANT_PREVIEW,
  headerCategoryGroups,
  visibleCategoryDescendants,
  type HeaderCategoryNode,
} from "@/features/categories/domain/header-category-menu";

function node(
  id: string,
  children: HeaderCategoryNode[] = [],
): HeaderCategoryNode {
  return {
    id,
    slug: id,
    title: id,
    count: 0,
    imageUrl: null,
    bannerImageUrl: null,
    children,
  };
}

describe("header category menu", () => {
  it("groups direct children and keeps nested descendants on the group", () => {
    const sofas = node("sofas", [node("corner")]);
    const tables = node("tables");
    const groups = headerCategoryGroups(node("furniture", [sofas, tables]));

    expect(groups.map((group) => group.parent.id)).toEqual(["sofas", "tables"]);
    expect(groups[0]?.parent.children).toEqual([]);
    expect(groups[0]?.children.map((child) => child.id)).toEqual(["corner"]);
  });

  it("caps collapsed descendants at the preview count", () => {
    const many = Array.from({ length: HEADER_CATEGORY_DESCENDANT_PREVIEW + 3 }, (_, i) =>
      node(`c${i}`),
    );
    expect(visibleCategoryDescendants(many, false)).toHaveLength(
      HEADER_CATEGORY_DESCENDANT_PREVIEW,
    );
    expect(visibleCategoryDescendants(many, true)).toHaveLength(many.length);
  });
});
