import { Search } from "lucide-react";
import type { ReactNode } from "react";

import {
  CATALOG_PICKER_CARD,
  CATALOG_PICKER_EMPTY,
  CATALOG_PICKER_HINT,
  CATALOG_PICKER_LIST,
  CATALOG_PICKER_SEARCH,
  CATALOG_PICKER_SEARCH_ICON,
  CATALOG_PICKER_SEARCH_WRAP,
  CATALOG_PICKER_TITLE,
} from "@/features/products/ui/product-drawer-catalog.classes";

type ProductDrawerCatalogPanelProps = {
  title: string;
  hint: string;
  searchLabel: string;
  searchPlaceholder: string;
  searchValue: string;
  emptyLabel: string;
  isEmpty: boolean;
  disabled: boolean;
  onSearchChange: (value: string) => void;
  children: ReactNode;
};

export function ProductDrawerCatalogPanel({
  title,
  hint,
  searchLabel,
  searchPlaceholder,
  searchValue,
  emptyLabel,
  isEmpty,
  disabled,
  onSearchChange,
  children,
}: ProductDrawerCatalogPanelProps) {
  return (
    <section className={CATALOG_PICKER_CARD}>
      <h3 className={CATALOG_PICKER_TITLE}>{title}</h3>
      <p className={CATALOG_PICKER_HINT}>{hint}</p>
      <label className={CATALOG_PICKER_SEARCH_WRAP}>
        <span className="sr-only">{searchLabel}</span>
        <Search className={CATALOG_PICKER_SEARCH_ICON} aria-hidden />
        <input
          value={searchValue}
          disabled={disabled}
          placeholder={searchPlaceholder}
          onChange={(event) => onSearchChange(event.target.value)}
          className={CATALOG_PICKER_SEARCH}
        />
      </label>
      <div className={CATALOG_PICKER_LIST}>
        {isEmpty ? (
          <p className={CATALOG_PICKER_EMPTY}>{emptyLabel}</p>
        ) : (
          children
        )}
      </div>
    </section>
  );
}
