"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Card } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import {
  ADMIN_TABLE,
  ADMIN_TABLE_CHECKBOX,
  ADMIN_TABLE_OUTER_SCROLL,
  ADMIN_TABLE_STATE_INSET,
} from "@/features/admin/ui/admin-table-classes";
import {
  softDeleteProductsAction,
  toggleProductFeaturedAction,
  toggleProductVisibilityAction,
} from "@/features/products/application/admin-product-actions";
import {
  adminProductsSortHref,
  type AdminProductsQueryState,
} from "@/features/products/domain/admin-products-query";
import { AdminProductRow } from "@/features/products/ui/AdminProductRow";
import { AdminProductsBulkBar } from "@/features/products/ui/AdminProductsBulkBar";
import { AdminProductsPagination } from "@/features/products/ui/AdminProductsPagination";
import { AdminProductsSortButton } from "@/features/products/ui/AdminProductsSortButton";
import {
  ADMIN_PRODUCTS_TABLE_CARD,
  ADMIN_PRODUCTS_TH,
  ADMIN_PRODUCTS_TH_CENTER,
} from "@/features/products/ui/admin-products.classes";
import type { AdminProductListItem } from "@/features/products/application/list-admin-products";
import { formatAdminMessage, getAdminCopy } from "@/features/admin/ui/get-admin-copy";

type AdminProductsTableProps = {
  locale: string;
  products: AdminProductListItem[];
  filters: AdminProductsQueryState;
  total: number;
  totalPages: number;
  onEdit: (product: AdminProductListItem) => void;
};

export function AdminProductsTable({
  locale,
  products,
  filters,
  total,
  totalPages,
  onEdit,
}: AdminProductsTableProps) {
  const copy = getAdminCopy(locale).products;
  const common = getAdminCopy(locale).common;
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [pendingDelete, setPendingDelete] = useState<{
    kind: "single" | "bulk";
    productIds: string[];
    label: string;
  } | null>(null);

  const allIds = products.map((product) => product.id);
  const allSelected =
    allIds.length > 0 && allIds.every((id) => selected.has(id));

  function toggleOne(id: string): void {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function runAction(action: () => Promise<void>): void {
    startTransition(async () => {
      setError(null);
      try {
        await action();
        router.refresh();
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : common.actionFailed);
      }
    });
  }

  function confirmDelete(): void {
    if (!pendingDelete) return;
    const productIds = pendingDelete.productIds;
    startTransition(async () => {
      setError(null);
      try {
        const result = await softDeleteProductsAction(locale, { productIds });
        if (!result.ok) throw new Error(result.error.message);
        setSelected((prev) => {
          const next = new Set(prev);
          for (const id of productIds) next.delete(id);
          return next;
        });
        setPendingDelete(null);
        router.refresh();
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : common.actionFailed);
      }
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {selected.size > 0 ? (
        <AdminProductsBulkBar
          locale={locale}
          selectedCount={selected.size}
          disabled={isPending}
          onDelete={() =>
            setPendingDelete({
              kind: "bulk",
              productIds: [...selected],
              label:
                selected.size === 1
                  ? copy.bulkLabelOne
                  : formatAdminMessage(copy.bulkLabelMany, { count: selected.size }),
            })
          }
        />
      ) : null}

      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      <Card className={ADMIN_PRODUCTS_TABLE_CARD}>
        {products.length === 0 ? (
          <p className={`${ADMIN_TABLE_STATE_INSET} text-center text-sm text-gray-600`}>
            {copy.empty}
          </p>
        ) : (
          <>
            <div className={ADMIN_TABLE_OUTER_SCROLL}>
              <table className={`${ADMIN_TABLE} divide-y divide-gray-200`}>
                <thead className="bg-gray-50/85">
                  <tr>
                    <th className="px-3 py-2.5">
                      <input
                        type="checkbox"
                        className={ADMIN_TABLE_CHECKBOX}
                        checked={allSelected}
                        onChange={() =>
                          setSelected(allSelected ? new Set() : new Set(allIds))
                        }
                        disabled={isPending}
                        aria-label={copy.selectAll}
                      />
                    </th>
                    <th className={ADMIN_PRODUCTS_TH}>
                      <AdminProductsSortButton
                        href={adminProductsSortHref(locale, filters, "title")}
                        label={copy.columnProduct}
                        suffix={`(${total})`}
                        field="title"
                        activeSort={filters.sort}
                        activeDir={filters.dir}
                      />
                    </th>
                    <th className={`max-w-[11rem] ${ADMIN_PRODUCTS_TH}`}>
                      {copy.columnCategory}
                    </th>
                    <th className={ADMIN_PRODUCTS_TH}>
                      <AdminProductsSortButton
                        href={adminProductsSortHref(locale, filters, "stock")}
                        label={copy.columnStock}
                        field="stock"
                        activeSort={filters.sort}
                        activeDir={filters.dir}
                      />
                    </th>
                    <th className={ADMIN_PRODUCTS_TH}>
                      <AdminProductsSortButton
                        href={adminProductsSortHref(locale, filters, "price")}
                        label={copy.columnPrice}
                        field="price"
                        activeSort={filters.sort}
                        activeDir={filters.dir}
                      />
                    </th>
                    <th className={ADMIN_PRODUCTS_TH_CENTER}>{copy.columnFeatured}</th>
                    <th className={ADMIN_PRODUCTS_TH_CENTER}>{common.actions}</th>
                    <th className={ADMIN_PRODUCTS_TH}>
                      <AdminProductsSortButton
                        href={adminProductsSortHref(locale, filters, "created")}
                        label={copy.columnCreated}
                        field="created"
                        activeSort={filters.sort}
                        activeDir={filters.dir}
                      />
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {products.map((product) => (
                    <AdminProductRow
                      key={product.id}
                      locale={locale}
                      product={product}
                      selected={selected.has(product.id)}
                      disabled={isPending}
                      onToggle={() => toggleOne(product.id)}
                      onEdit={() => onEdit(product)}
                      onFeatured={() =>
                        runAction(async () => {
                          const result = await toggleProductFeaturedAction(
                            locale,
                            product.id,
                          );
                          if (!result.ok) throw new Error(result.error.message);
                        })
                      }
                      onDelete={() =>
                        setPendingDelete({
                          kind: "single",
                          productIds: [product.id],
                          label: product.title,
                        })
                      }
                      onVisibility={() =>
                        runAction(async () => {
                          const result = await toggleProductVisibilityAction(
                            locale,
                            product.id,
                          );
                          if (!result.ok) throw new Error(result.error.message);
                        })
                      }
                    />
                  ))}
                </tbody>
              </table>
            </div>
            <AdminProductsPagination
              locale={locale}
              filters={filters}
              total={total}
              totalPages={totalPages}
            />
          </>
        )}
      </Card>

      <ConfirmDialog
        open={pendingDelete !== null}
        title={common.delete}
        confirmLabel={common.delete}
        cancelLabel={common.cancel}
        description={
          pendingDelete?.kind === "bulk"
            ? formatAdminMessage(common.deleteConfirmBulk, {
                label: pendingDelete.label,
              })
            : pendingDelete
              ? formatAdminMessage(common.deleteConfirm, {
                  entity: copy.entity,
                  name: pendingDelete.label,
                })
              : ""
        }
        isPending={isPending}
        onClose={() => {
          if (!isPending) setPendingDelete(null);
        }}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
