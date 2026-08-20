"use client";

import { ChevronRight } from "lucide-react";
import { useState } from "react";

import {
  categoryHasSelectedDescendant,
  type CatalogCategoryFacet,
} from "@/features/products/domain/catalog-filters";
import { CatalogFilterCheckRow } from "@/features/products/ui/CatalogFilterCheckRow";

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
    <ul className="flex flex-col">
      {nodes.map((node) => (
        <CatalogCategoryNode
          key={node.id}
          node={node}
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
  selectedSlugs: ReadonlySet<string>;
  expandLabel: string;
  collapseLabel: string;
  onToggle: (slug: string) => void;
};

function CatalogCategoryNode({
  node,
  selectedSlugs,
  expandLabel,
  collapseLabel,
  onToggle,
}: CatalogCategoryNodeProps) {
  const hasChildren = node.children.length > 0;
  const [open, setOpen] = useState(() =>
    categoryHasSelectedDescendant(node, selectedSlugs),
  );

  return (
    <li>
      <div className="flex items-center gap-1">
        <CatalogFilterCheckRow
          label={node.title}
          selected={selectedSlugs.has(node.slug)}
          count={node.count}
          onToggle={() => onToggle(node.slug)}
        />
        {hasChildren ? (
          <button
            type="button"
            aria-expanded={open}
            aria-label={open ? collapseLabel : expandLabel}
            onClick={() => setOpen((current) => !current)}
            className="flex h-7 w-7 shrink-0 items-center justify-center text-gray-400"
          >
            <ChevronRight
              className={`h-4 w-4 transition-transform ${open ? "rotate-90" : ""}`}
            />
          </button>
        ) : null}
      </div>
      {hasChildren && open ? (
        <ul className="ml-4">
          {node.children.map((child) => (
            <CatalogCategoryNode
              key={child.id}
              node={child}
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
