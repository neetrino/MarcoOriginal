"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

import {
  categoryHasSelectedDescendant,
  type CatalogCategoryFacet,
} from "@/features/products/domain/catalog-filters";
import { CatalogFilterCheckRow } from "@/features/products/ui/CatalogFilterCheckRow";
import {
  CATALOG_FILTER_LIST,
  CATALOG_FILTER_ROW_SELECTED,
  catalogFilterCategoryLabelClass,
} from "@/features/products/ui/catalog-filter-classes";

type CatalogCategoryFilterProps = {
  nodes: readonly CatalogCategoryFacet[];
  selectedSlugs: ReadonlySet<string>;
  expandLabel: string;
  collapseLabel: string;
  onToggle: (slug: string) => void;
};

export function CatalogCategoryFilter({
  nodes,
  selectedSlugs,
  expandLabel,
  collapseLabel,
  onToggle,
}: CatalogCategoryFilterProps) {
  if (nodes.length === 0) return null;

  return (
    <ul className={CATALOG_FILTER_LIST}>
      {nodes.map((node) => (
        <CatalogCategoryNode
          key={node.id}
          node={node}
          depth={0}
          selectedSlugs={selectedSlugs}
          expandLabel={expandLabel}
          collapseLabel={collapseLabel}
          onToggle={onToggle}
        />
      ))}
    </ul>
  );
}

type CatalogCategoryNodeProps = {
  node: CatalogCategoryFacet;
  depth: number;
  selectedSlugs: ReadonlySet<string>;
  expandLabel: string;
  collapseLabel: string;
  onToggle: (slug: string) => void;
};

function CatalogCategoryNode({
  node,
  depth,
  selectedSlugs,
  expandLabel,
  collapseLabel,
  onToggle,
}: CatalogCategoryNodeProps) {
  const hasChildren = node.children.length > 0;
  const selected = selectedSlugs.has(node.slug);
  const [open, setOpen] = useState(() =>
    categoryHasSelectedDescendant(node, selectedSlugs),
  );

  return (
    <li className="flex flex-col gap-3">
      <div
        className={`flex items-center gap-2 ${selected ? CATALOG_FILTER_ROW_SELECTED : ""}`}
        style={depth > 0 ? { paddingLeft: depth * 14 } : undefined}
      >
        <CatalogFilterCheckRow
          label={node.title}
          selected={selected}
          count={node.count}
          labelClassName={catalogFilterCategoryLabelClass(selected, depth === 0)}
          onToggle={() => onToggle(node.slug)}
        />
        {hasChildren ? (
          <CatalogCategoryExpandButton
            open={open}
            expandLabel={expandLabel}
            collapseLabel={collapseLabel}
            onToggle={() => setOpen((current) => !current)}
          />
        ) : null}
      </div>
      {hasChildren && open ? (
        <ul className="flex flex-col gap-3">
          {node.children.map((child) => (
            <CatalogCategoryNode
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedSlugs={selectedSlugs}
              expandLabel={expandLabel}
              collapseLabel={collapseLabel}
              onToggle={onToggle}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

function CatalogCategoryExpandButton({
  open,
  expandLabel,
  collapseLabel,
  onToggle,
}: {
  open: boolean;
  expandLabel: string;
  collapseLabel: string;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      aria-expanded={open}
      aria-label={open ? collapseLabel : expandLabel}
      onClick={onToggle}
      className="flex h-8 w-8 shrink-0 items-center justify-center text-[#5d7285] hover:text-[#314158]"
    >
      <ChevronDown
        className={`h-5 w-5 transition-transform ${open ? "rotate-0" : "-rotate-90"}`}
        aria-hidden
      />
    </button>
  );
}
