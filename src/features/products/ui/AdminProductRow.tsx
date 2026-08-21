"use client";

import Image from "next/image";

import { ADMIN_TABLE_CHECKBOX } from "@/features/admin/ui/admin-table-classes";
import { formatAdminMessage, getAdminCopy } from "@/features/admin/ui/get-admin-copy";
import type { AdminProductListItem } from "@/features/products/application/list-admin-products";
import {
  ADMIN_PRODUCTS_CATEGORY_PILL,
  ADMIN_PRODUCTS_FEATURED_BUTTON,
  ADMIN_PRODUCTS_ICON_BUTTON,
  ADMIN_PRODUCTS_ICON_BUTTON_DANGER,
  ADMIN_PRODUCTS_ROW,
  ADMIN_PRODUCTS_TD,
} from "@/features/products/ui/admin-products.classes";
import { formatMoneyAmount } from "@/lib/money/format";

type AdminProductRowProps = {
  locale: string;
  product: AdminProductListItem;
  selected: boolean;
  disabled: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onFeatured: () => void;
  onDelete: () => void;
  onVisibility: () => void;
};

const STAR_PATH =
  "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z";

export function AdminProductRow({
  locale,
  product,
  selected,
  disabled,
  onToggle,
  onEdit,
  onFeatured,
  onDelete,
  onVisibility,
}: AdminProductRowProps) {
  const copy = getAdminCopy(locale).products;
  const common = getAdminCopy(locale).common;
  const isActive = product.status === "ACTIVE";
  const createdLabel = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  }).format(new Date(product.createdAt));

  return (
    <tr
      className={ADMIN_PRODUCTS_ROW}
      tabIndex={0}
      onClick={onEdit}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onEdit();
        }
      }}
    >
      <td className={ADMIN_PRODUCTS_TD} onClick={(event) => event.stopPropagation()}>
        <input
          type="checkbox"
          className={ADMIN_TABLE_CHECKBOX}
          checked={selected}
          onChange={onToggle}
          disabled={disabled}
          aria-label={formatAdminMessage(common.selectAria, { name: product.title })}
        />
      </td>
      <td className={`max-w-xs ${ADMIN_PRODUCTS_TD}`}>
        <ProductIdentity locale={locale} product={product} />
      </td>
      <td className={`max-w-[11rem] ${ADMIN_PRODUCTS_TD} align-top`}>
        {product.categoryLabels.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {product.categoryLabels.map((label) => (
              <span key={label} className={ADMIN_PRODUCTS_CATEGORY_PILL} title={label}>
                {label}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-sm text-gray-400">—</span>
        )}
      </td>
      <td className={ADMIN_PRODUCTS_TD}>
        <span className="text-sm font-medium text-marco-slate">
          {formatAdminMessage(copy.pcs, { count: product.stockOnHand })}
        </span>
      </td>
      <td className={`whitespace-nowrap ${ADMIN_PRODUCTS_TD}`}>
        <span className="text-sm font-semibold text-marco-ink">
          {formatMoneyAmount(product.priceAmount, "AMD", locale)}
        </span>
        {product.compareAtAmount != null &&
        product.compareAtAmount > product.priceAmount ? (
          <span className="mt-0.5 block text-xs text-gray-500 line-through">
            {formatMoneyAmount(product.compareAtAmount, "AMD", locale)}
          </span>
        ) : null}
      </td>
      <td className={`${ADMIN_PRODUCTS_TD} text-center`}>
        <button
          type="button"
          disabled={disabled}
          onClick={(event) => {
            event.stopPropagation();
            onFeatured();
          }}
          className={ADMIN_PRODUCTS_FEATURED_BUTTON}
          aria-pressed={product.isFeatured}
          aria-label={product.isFeatured ? copy.unfeature : copy.feature}
        >
          <svg
            className={`h-6 w-6 ${
              product.isFeatured
                ? "fill-marco-yellow text-marco-yellow drop-shadow-sm"
                : "fill-none text-gray-400 opacity-50"
            }`}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden
          >
            <path strokeLinecap="round" strokeLinejoin="round" d={STAR_PATH} />
          </svg>
        </button>
      </td>
      <td className={`${ADMIN_PRODUCTS_TD} text-center`} onClick={(event) => event.stopPropagation()}>
        <div className="flex flex-nowrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={onEdit}
            className={ADMIN_PRODUCTS_ICON_BUTTON}
            aria-label={formatAdminMessage(common.editAria, { name: product.title })}
          >
            <EditIcon />
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={onDelete}
            className={ADMIN_PRODUCTS_ICON_BUTTON_DANGER}
            aria-label={formatAdminMessage(common.deleteAria, { name: product.title })}
          >
            <TrashIcon />
          </button>
          <button
            type="button"
            role="switch"
            aria-checked={isActive}
            disabled={disabled}
            onClick={onVisibility}
            className={`relative inline-flex h-6 w-10 shrink-0 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-marco-slate focus-visible:ring-offset-2 ${
              isActive ? "bg-emerald-500" : "bg-gray-300"
            }`}
            aria-label={isActive ? copy.deactivate : copy.activate}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isActive ? "translate-x-[21px]" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </td>
      <td className={`whitespace-nowrap ${ADMIN_PRODUCTS_TD} text-sm text-marco-slate`}>
        {createdLabel}
      </td>
    </tr>
  );
}

function ProductIdentity({
  locale,
  product,
}: {
  locale: string;
  product: AdminProductListItem;
}) {
  const copy = getAdminCopy(locale).products;
  return (
    <div className="flex items-center gap-2.5">
      {product.imageUrl ? (
        <Image
          src={product.imageUrl}
          alt={product.title}
          width={40}
          height={40}
          className="h-10 w-10 shrink-0 rounded-lg border border-gray-200 object-cover shadow-sm"
        />
      ) : (
        <div
          className="h-10 w-10 shrink-0 rounded-lg border border-gray-200 bg-gray-100 shadow-sm"
          aria-hidden
        />
      )}
      <div className="min-w-0 flex-1">
        <span className="text-sm font-semibold break-words text-marco-ink transition-colors group-hover:text-amber-900">
          {product.title}
        </span>
        {product.sku ? (
          <p className="mt-0.5 truncate text-xs text-gray-500">
            {formatAdminMessage(copy.skuLabel, { sku: product.sku })}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function EditIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  );
}
