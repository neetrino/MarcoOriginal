"use client";

import { useMemo } from "react";

import type { AdminCategoryOption } from "@/features/products/application/list-admin-products";
import {
  buildCategoryTree,
  filterCategoryTree,
  type CategoryTreeNode,
} from "@/features/categories/domain/category-tree";

const INDENT_PX = 16;

type AdminProductsCategoryTreeProps = {
  categories: ReadonlyArray<AdminCategoryOption>;
  selectedId?: string;
  search: string;
  emptyLabel: string;
  notFoundLabel: string;
  onSelect: (categoryId: string | undefined) => void;
};

function titleMatches(
  node: CategoryTreeNode<AdminCategoryOption>,
  query: string,
): boolean {
  return node.title.toLowerCase().includes(query);
}

export function AdminProductsCategoryTree({
  categories,
  selectedId,
  search,
  emptyLabel,
  notFoundLabel,
  onSelect,
}: AdminProductsCategoryTreeProps) {
  const tree = useMemo(
    () => buildCategoryTree([...categories]),
    [categories],
  );
  const query = search.trim().toLowerCase();
  const visible = useMemo(
    () =>
      query
        ? filterCategoryTree(tree, (node) => titleMatches(node, query))
        : tree,
    [query, tree],
  );

  if (categories.length === 0) {
    return <p className="px-2 py-3 text-sm text-gray-500">{emptyLabel}</p>;
  }
  if (visible.length === 0) {
    return <p className="px-2 py-3 text-sm text-gray-500">{notFoundLabel}</p>;
  }

  return (
    <ul className="space-y-0.5">
      {visible.map((node) => (
        <CategoryTreeItem
          key={node.id}
          node={node}
          depth={0}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      ))}
    </ul>
  );
}

function CategoryTreeItem({
  node,
  depth,
  selectedId,
  onSelect,
}: {
  node: CategoryTreeNode<AdminCategoryOption>;
  depth: number;
  selectedId?: string;
  onSelect: (categoryId: string | undefined) => void;
}) {
  const selected = node.id === selectedId;

  return (
    <li>
      <label
        className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-marco-ink hover:bg-gray-50"
        style={{ paddingLeft: 8 + depth * INDENT_PX }}
      >
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onSelect(selected ? undefined : node.id)}
          className="h-4 w-4 rounded border-gray-300 text-marco-ink focus:ring-marco-slate"
        />
        <span className="min-w-0 truncate">{node.title}</span>
      </label>
      {node.children.length > 0 ? (
        <ul>
          {node.children.map((child) => (
            <CategoryTreeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}
