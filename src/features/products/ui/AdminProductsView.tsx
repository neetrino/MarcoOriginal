"use client";

import { useState } from "react";

import type {
  AdminCategoryOption,
  AdminProductListItem,
} from "@/features/products/application/list-admin-products";
import type { AdminAttributeListItem } from "@/features/attributes/domain/attribute-admin-model";
import type { AdminProductsQueryState } from "@/features/products/domain/admin-products-query";
import { AdminProductsFilters } from "@/features/products/ui/AdminProductsFilters";
import { AdminProductsTable } from "@/features/products/ui/AdminProductsTable";
import {
  ADMIN_PRODUCTS_ADD_BUTTON,
  ADMIN_PRODUCTS_TITLE,
} from "@/features/products/ui/admin-products.classes";
import { ProductDrawer } from "@/features/products/ui/ProductDrawer";
import { getAdminCopy } from "@/features/admin/ui/get-admin-copy";

type AdminProductsViewProps = {
  locale: string;
  products: AdminProductListItem[];
  categories: AdminCategoryOption[];
  brands: readonly { id: string; title: string }[];
  attributes: readonly AdminAttributeListItem[];
  filters: AdminProductsQueryState;
  total: number;
  totalPages: number;
};

export function AdminProductsView({
  locale,
  products,
  categories,
  brands,
  attributes,
  filters,
  total,
  totalPages,
}: AdminProductsViewProps) {
  const copy = getAdminCopy(locale).products;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] =
    useState<AdminProductListItem | null>(null);

  function openCreate(): void {
    setEditingProduct(null);
    setDrawerOpen(true);
  }

  function closeDrawer(): void {
    setDrawerOpen(false);
    setEditingProduct(null);
  }

  return (
    <>
      <header className="mb-5 sm:mb-7">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <h1 className={ADMIN_PRODUCTS_TITLE}>{copy.title}</h1>
          <button
            type="button"
            onClick={openCreate}
            className={ADMIN_PRODUCTS_ADD_BUTTON}
          >
            <svg
              className="h-4 w-4 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            {copy.addNew}
          </button>
        </div>
      </header>

      <AdminProductsFilters
        locale={locale}
        filters={filters}
        categories={categories}
      />

      <AdminProductsTable
        locale={locale}
        products={products}
        filters={filters}
        total={total}
        totalPages={totalPages}
        onEdit={(product) => {
          setEditingProduct(product);
          setDrawerOpen(true);
        }}
      />

      <ProductDrawer
        locale={locale}
        open={drawerOpen}
        onClose={closeDrawer}
        product={editingProduct}
        categories={categories}
        brands={brands}
        attributes={attributes}
      />
    </>
  );
}
