"use client";

import { ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";

import {
  buildCategoryTree,
  type CategoryTreeNode,
} from "@/features/categories/domain/category-tree";
import type { AdminCategoryOption } from "@/features/products/application/list-admin-products";
import { ProductDrawerCatalogCheck } from "@/features/products/ui/ProductDrawerCatalogCheck";
import { CATALOG_PICKER_ROW } from "@/features/products/ui/product-drawer-catalog.classes";

const INDENT_PX = 16;

type ProductDrawerCategoryTreeProps = {
  categories: readonly AdminCategoryOption[];
  selectedIds: readonly string[];
  expandLabel: string;
  collapseLabel: string;
  disabled: boolean;
  onToggle: (id: string) => void;
};

export function ProductDrawerCategoryTree({
  categories,
  selectedIds,
  expandLabel,
  collapseLabel,
  disabled,
  onToggle,
}: ProductDrawerCategoryTreeProps) {
  const tree = useMemo(
    () => buildCategoryTree([...categories]),
    [categories],
  );
  const selected = useMemo(() => new Set(selectedIds), [selectedIds]);

  return (
    <ul className="space-y-0.5">
      {tree.map((node) => (
        <CategoryTreeItem
          key={node.id}
          node={node}
          depth={0}
          selected={selected}
          expandLabel={expandLabel}
          collapseLabel={collapseLabel}
          disabled={disabled}
          onToggle={onToggle}
        />
      ))}
    </ul>
  );
}

function categoryHasSelected(
  node: CategoryTreeNode<AdminCategoryOption>,
  selected: ReadonlySet<string>,
): boolean {
  if (selected.has(node.id)) return true;
  return node.children.some((child) => categoryHasSelected(child, selected));
}

function CategoryTreeItem({
  node,
  depth,
  selected,
  expandLabel,
  collapseLabel,
  disabled,
  onToggle,
}: {
  node: CategoryTreeNode<AdminCategoryOption>;
  depth: number;
  selected: ReadonlySet<string>;
  expandLabel: string;
  collapseLabel: string;
  disabled: boolean;
  onToggle: (id: string) => void;
}) {
  const hasChildren = node.children.length > 0;
  const isSelected = selected.has(node.id);
  const [open, setOpen] = useState(() => categoryHasSelected(node, selected));

  return (
    <li>
      <div
        className={CATALOG_PICKER_ROW}
        style={depth > 0 ? { paddingLeft: 4 + depth * INDENT_PX } : undefined}
      >
        <button
          type="button"
          disabled={disabled}
          aria-pressed={isSelected}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
          onClick={() => onToggle(node.id)}
        >
          <ProductDrawerCatalogCheck selected={isSelected} />
          <span className="min-w-0 truncate">{node.title}</span>
        </button>
        {hasChildren ? (
          <button
            type="button"
            aria-expanded={open}
            aria-label={open ? collapseLabel : expandLabel}
            disabled={disabled}
            className="flex h-8 w-8 shrink-0 items-center justify-center text-slate-400 hover:text-marco-ink"
            onClick={() => setOpen((current) => !current)}
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform ${open ? "rotate-0" : "-rotate-90"}`}
              aria-hidden
            />
          </button>
        ) : null}
      </div>
      {hasChildren && open ? (
        <ul>
          {node.children.map((child) => (
            <CategoryTreeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              selected={selected}
              expandLabel={expandLabel}
              collapseLabel={collapseLabel}
              disabled={disabled}
              onToggle={onToggle}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}
