"use client";

import { useMemo, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  ConfirmDialog,
  deleteConfirmDescription,
} from "@/components/ui/ConfirmDialog";
import { ADMIN_PAGE_TITLE } from "@/features/admin/ui/admin-form-classes";
import { AdminSearchInput } from "@/features/admin/ui/AdminSearchInput";
import {
  ADMIN_TABLE,
  ADMIN_TABLE_CARD,
  ADMIN_TABLE_OUTER_SCROLL,
  ADMIN_TABLE_ROW,
  ADMIN_TABLE_STATE_INSET,
  ADMIN_TABLE_TBODY,
  ADMIN_TABLE_TD,
  ADMIN_TABLE_TD_CENTER,
  ADMIN_TABLE_TH,
  ADMIN_TABLE_TH_CENTER,
  ADMIN_TABLE_THEAD,
} from "@/features/admin/ui/admin-table-classes";
import { deleteBrandAction } from "@/features/brands/actions";
import type { AdminBrandListItem } from "@/features/brands/application/list-admin-brands";
import { AddBrandDrawer } from "@/features/brands/ui/AddBrandDrawer";

type AdminBrandsViewProps = {
  locale: string;
  brands: AdminBrandListItem[];
};

export function AdminBrandsView({ locale, brands }: AdminBrandsViewProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<AdminBrandListItem | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [pendingDelete, setPendingDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const needle = query.trim().toLowerCase();
  const visible = useMemo(() => {
    if (!needle) return brands;
    return brands.filter(
      (brand) =>
        brand.title.toLowerCase().includes(needle) ||
        brand.sku.toLowerCase().includes(needle),
    );
  }, [brands, needle]);

  function confirmDelete(): void {
    if (!pendingDelete) return;
    const brandId = pendingDelete.id;

    startTransition(async () => {
      setError(null);
      const result = await deleteBrandAction(locale, brandId);
      if (!result.ok) {
        setError(result.error.message);
        return;
      }
      setPendingDelete(null);
      router.refresh();
    });
  }

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className={ADMIN_PAGE_TITLE}>Brands</h1>
        <Button
          type="button"
          size="sm"
          onClick={() => {
            setEditingBrand(null);
            setDrawerOpen(true);
          }}
          className="inline-flex items-center gap-1.5"
        >
          <Plus className="h-4 w-4" aria-hidden />
          Add new brand
        </Button>
      </div>

      <AdminSearchInput
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search brands"
        wrapperClassName="mb-4"
        aria-label="Search brands"
      />

      {error ? <p className="mb-3 text-sm text-red-700">{error}</p> : null}

      <Card className={ADMIN_TABLE_CARD}>
        {visible.length === 0 ? (
          <p className={`${ADMIN_TABLE_STATE_INSET} text-sm text-gray-600`}>
            {brands.length === 0
              ? "No brands yet."
              : "No brands match this search."}
          </p>
        ) : (
          <div className={ADMIN_TABLE_OUTER_SCROLL}>
            <table className={ADMIN_TABLE}>
              <thead className={ADMIN_TABLE_THEAD}>
                <tr>
                  <th className={ADMIN_TABLE_TH}>Image</th>
                  <th className={ADMIN_TABLE_TH}>Brand</th>
                  <th className={ADMIN_TABLE_TH}>SKU</th>
                  <th className={ADMIN_TABLE_TH_CENTER}>Actions</th>
                </tr>
              </thead>
              <tbody className={ADMIN_TABLE_TBODY}>
                {visible.map((brand) => (
                  <tr key={brand.id} className={ADMIN_TABLE_ROW}>
                    <td className={ADMIN_TABLE_TD}>
                      <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded border border-dashed border-gray-300 bg-gray-50">
                        {brand.imageUrl ? (
                          <Image
                            src={brand.imageUrl}
                            alt=""
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </div>
                    </td>
                    <td className={ADMIN_TABLE_TD}>
                      <p className="font-medium text-gray-900">{brand.title}</p>
                    </td>
                    <td className={ADMIN_TABLE_TD}>
                      <span className="text-sm text-gray-500">{brand.sku}</span>
                    </td>
                    <td className={ADMIN_TABLE_TD_CENTER}>
                      <div className="inline-flex items-center justify-center gap-1">
                        <button
                          type="button"
                          className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                          aria-label={`Edit ${brand.title}`}
                          onClick={() => {
                            setEditingBrand(brand);
                            setDrawerOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          disabled={isPending}
                          onClick={() =>
                            setPendingDelete({
                              id: brand.id,
                              title: brand.title,
                            })
                          }
                          className="rounded p-1.5 text-red-600 hover:bg-red-50"
                          aria-label={`Delete ${brand.title}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <AddBrandDrawer
        locale={locale}
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setEditingBrand(null);
        }}
        brand={editingBrand}
      />

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete"
        description={
          pendingDelete
            ? deleteConfirmDescription("brand", pendingDelete.title)
            : ""
        }
        isPending={isPending}
        onClose={() => {
          if (!isPending) setPendingDelete(null);
        }}
        onConfirm={confirmDelete}
      />
    </section>
  );
}
