import { Copy, Pencil, Trash2 } from "lucide-react";

import { formatAdminMessage } from "@/features/admin/ui/get-admin-copy";
import type { AdminPromotionListItem } from "@/features/promotions/application/queries";
import {
  ADMIN_COUPONS_ICON_BUTTON,
  ADMIN_COUPONS_ICON_BUTTON_DANGER,
  ADMIN_COUPONS_STATUS_ACTIVE,
  ADMIN_COUPONS_STATUS_INACTIVE,
  ADMIN_COUPONS_TD,
} from "@/features/promotions/ui/admin-coupons.classes";
import { formatPromoDiscount } from "@/features/promotions/ui/admin-coupons-display";

type CouponCopy = {
  active: string;
  amd: string;
  copy: string;
  entity: string;
  inactive: string;
};

type CommonCopy = {
  delete: string;
  deleteAria: string;
  edit: string;
  editAria: string;
};

type AdminCouponRowProps = {
  promo: AdminPromotionListItem;
  copy: CouponCopy;
  common: CommonCopy;
  disabled: boolean;
  onCopy: (code: string) => void;
  onEdit: (promo: AdminPromotionListItem) => void;
  onDelete: (promo: AdminPromotionListItem) => void;
};

export function AdminCouponRow({
  promo,
  copy,
  common,
  disabled,
  onCopy,
  onEdit,
  onDelete,
}: AdminCouponRowProps) {
  const code = promo.code ?? "—";
  const name = promo.code ?? copy.entity;

  return (
    <tr className="border-b border-gray-200/70">
      <td className={`${ADMIN_COUPONS_TD} font-mono font-semibold text-marco-ink`}>
        {code}
      </td>
      <td className={ADMIN_COUPONS_TD}>
        {formatPromoDiscount(promo.discountType, promo.discountValue, copy.amd)}
      </td>
      <td className={ADMIN_COUPONS_TD}>
        <span
          className={
            promo.isActive
              ? ADMIN_COUPONS_STATUS_ACTIVE
              : ADMIN_COUPONS_STATUS_INACTIVE
          }
        >
          {promo.isActive ? copy.active : copy.inactive}
        </span>
      </td>
      <td className={`${ADMIN_COUPONS_TD} tabular-nums`}>{promo.usedCount}</td>
      <td className={ADMIN_COUPONS_TD}>
        <div className="flex flex-nowrap items-center gap-2">
          <button
            type="button"
            className={ADMIN_COUPONS_ICON_BUTTON}
            aria-label={copy.copy}
            title={copy.copy}
            disabled={disabled || promo.code == null}
            onClick={() => {
              if (promo.code) onCopy(promo.code);
            }}
          >
            <Copy className="h-4 w-4 shrink-0" aria-hidden />
          </button>
          <button
            type="button"
            className={ADMIN_COUPONS_ICON_BUTTON}
            aria-label={formatAdminMessage(common.editAria, { name })}
            title={common.edit}
            disabled={disabled}
            onClick={() => onEdit(promo)}
          >
            <Pencil className="h-4 w-4 shrink-0" aria-hidden />
          </button>
          <button
            type="button"
            className={ADMIN_COUPONS_ICON_BUTTON_DANGER}
            aria-label={formatAdminMessage(common.deleteAria, { name })}
            title={common.delete}
            disabled={disabled}
            onClick={() => onDelete(promo)}
          >
            <Trash2 className="h-4 w-4 shrink-0" aria-hidden />
          </button>
        </div>
      </td>
    </tr>
  );
}
