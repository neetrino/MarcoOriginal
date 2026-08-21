"use client";

import type { ReactNode } from "react";

import { CATALOG_GRID } from "@/features/products/ui/catalog-filter-classes";
import { useOptionalCatalogViewMode } from "@/features/products/ui/CatalogViewModeProvider";
import { catalogGridClassName } from "@/features/products/ui/catalog-view-mode";

type CatalogProductGridShellProps = {
  children: ReactNode;
  fallbackClassName?: string;
};

export function CatalogProductGridShell({
  children,
  fallbackClassName = CATALOG_GRID,
}: CatalogProductGridShellProps) {
  const view = useOptionalCatalogViewMode();
  const className = view ? catalogGridClassName(view.mode) : fallbackClassName;
  const listItems =
    view?.mode === "list"
      ? "[&>*]:w-full [&>*]:justify-start [&>*]:pb-0 [&>*]:pr-0 [&>*]:sm:pr-0 [&>*]:sm:pb-0"
      : "";

  return <div className={`${className} ${listItems}`.trim()}>{children}</div>;
}
