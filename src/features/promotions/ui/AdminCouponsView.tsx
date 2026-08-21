"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Card } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import {
  formatAdminMessage,
  getAdminCopy,
} from "@/features/admin/ui/get-admin-copy";
import { deletePromotionAction } from "@/features/promotions/application/upsert-promotion";
import type { AdminPromotionListItem } from "@/features/promotions/application/queries";
import { AdminCouponRow } from "@/features/promotions/ui/AdminCouponRow";
import {
  ADMIN_COUPONS_ADD_BUTTON,
  ADMIN_COUPONS_SUBTITLE,
  ADMIN_COUPONS_TABLE_CARD,
  ADMIN_COUPONS_TH,
  ADMIN_COUPONS_TITLE,
} from "@/features/promotions/ui/admin-coupons.classes";
import { CouponDrawer } from "@/features/promotions/ui/CouponDrawer";
import { logger } from "@/lib/observability/logger";

type AdminCouponsViewProps = {
  locale: string;
  coupons: AdminPromotionListItem[];
};

export function AdminCouponsView({ locale, coupons }: AdminCouponsViewProps) {
  const copy = getAdminCopy(locale).coupons;
  const common = getAdminCopy(locale).common;
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] =
    useState<AdminPromotionListItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [pendingDelete, setPendingDelete] = useState<{
    id: string;
    code: string;
  } | null>(null);

  function openCreate(): void {
    setEditingCoupon(null);
    setDrawerOpen(true);
  }

  function openEdit(coupon: AdminPromotionListItem): void {
    setEditingCoupon(coupon);
    setDrawerOpen(true);
  }

  function closeDrawer(): void {
    setDrawerOpen(false);
    setEditingCoupon(null);
  }

  async function copyCode(code: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(code);
    } catch (caught) {
      logger.warn("Failed to copy promo code", {
        code,
        error: caught instanceof Error ? caught.message : "unknown",
      });
    }
  }

  function confirmDelete(): void {
    if (!pendingDelete) return;
    const promoId = pendingDelete.id;
    startTransition(async () => {
      setError(null);
      try {
        const result = await deletePromotionAction(locale, promoId);
        if (!result.ok) {
          throw new Error(result.error.message);
        }
        setPendingDelete(null);
        router.refresh();
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : common.actionFailed);
      }
    });
  }

  return (
    <section>
      <header className="mb-5 sm:mb-7">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className="min-w-0">
            <h1 className={ADMIN_COUPONS_TITLE}>{copy.title}</h1>
            <p className={ADMIN_COUPONS_SUBTITLE}>{copy.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className={`${ADMIN_COUPONS_ADD_BUTTON} shrink-0 sm:mt-0.5`}
          >
            {copy.add}
          </button>
        </div>
      </header>

      {error ? <p className="mb-3 text-sm text-red-700">{error}</p> : null}

      <Card className={ADMIN_COUPONS_TABLE_CARD}>
        {coupons.length === 0 ? (
          <p className="p-6 text-sm text-marco-slate/70">{copy.empty}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="border-b border-gray-200 bg-gray-50 text-left">
                <tr>
                  <th className={ADMIN_COUPONS_TH}>{copy.columnCode}</th>
                  <th className={ADMIN_COUPONS_TH}>{copy.columnDiscount}</th>
                  <th className={ADMIN_COUPONS_TH}>{copy.columnStatus}</th>
                  <th className={ADMIN_COUPONS_TH}>{copy.columnUsage}</th>
                  <th className={ADMIN_COUPONS_TH}>{common.actions}</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((promo) => (
                  <AdminCouponRow
                    key={promo.id}
                    promo={promo}
                    copy={copy}
                    common={common}
                    disabled={isPending}
                    onCopy={(code) => {
                      void copyCode(code);
                    }}
                    onEdit={openEdit}
                    onDelete={(item) =>
                      setPendingDelete({
                        id: item.id,
                        code: item.code ?? copy.entity,
                      })
                    }
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <CouponDrawer
        locale={locale}
        open={drawerOpen}
        onClose={closeDrawer}
        coupon={editingCoupon}
      />

      <ConfirmDialog
        open={pendingDelete !== null}
        title={common.delete}
        confirmLabel={common.delete}
        cancelLabel={common.cancel}
        description={
          pendingDelete
            ? formatAdminMessage(common.deleteConfirm, {
                entity: copy.entity,
                name: pendingDelete.code,
              })
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
