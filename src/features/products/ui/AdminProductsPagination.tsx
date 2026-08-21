"use client";

import Link from "next/link";
import { useId } from "react";

import type { AdminProductsQueryState } from "@/features/products/domain/admin-products-query";
import { adminProductsHref } from "@/features/products/domain/admin-products-query";
import { buildAdminPaginationItems } from "@/features/products/domain/admin-table-pagination";
import {
  ADMIN_PRODUCTS_PAGE_BUTTON,
  ADMIN_PRODUCTS_PAGE_CURRENT,
  ADMIN_PRODUCTS_PAGE_IDLE,
  ADMIN_PRODUCTS_PAGINATION,
} from "@/features/products/ui/admin-products.classes";
import { formatAdminMessage, getAdminCopy } from "@/features/admin/ui/get-admin-copy";

type AdminProductsPaginationProps = {
  locale: string;
  filters: AdminProductsQueryState;
  total: number;
  totalPages: number;
};

export function AdminProductsPagination({
  locale,
  filters,
  total,
  totalPages,
}: AdminProductsPaginationProps) {
  const common = getAdminCopy(locale).common;
  const goFieldId = useId();

  if (totalPages <= 1) return null;

  const pageItems = buildAdminPaginationItems(filters.page, totalPages);

  return (
    <div className={ADMIN_PRODUCTS_PAGINATION}>
      <p className="mb-4 text-center text-sm font-medium text-marco-slate sm:mb-3 sm:text-left">
        {formatAdminMessage(common.showingPage, {
          page: filters.page,
          totalPages,
          total,
        })}
      </p>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
        <nav
          className="flex flex-wrap items-center justify-center gap-2 sm:justify-start"
          aria-label={common.paginationAria}
        >
          <PaginationLink
            href={adminProductsHref(locale, filters, {
              page: Math.max(1, filters.page - 1),
            })}
            disabled={filters.page === 1}
            label={common.previous}
          />
          {pageItems.map((item, index) =>
            item === "ellipsis" ? (
              <span
                key={`e-${index}`}
                className="select-none px-1 text-base font-semibold text-gray-400"
                aria-hidden
              >
                …
              </span>
            ) : (
              <Link
                key={item}
                href={adminProductsHref(locale, filters, { page: item })}
                aria-label={formatAdminMessage(common.pageNumberAria, { n: item })}
                aria-current={item === filters.page ? "page" : undefined}
                className={`${ADMIN_PRODUCTS_PAGE_BUTTON} ${
                  item === filters.page
                    ? ADMIN_PRODUCTS_PAGE_CURRENT
                    : ADMIN_PRODUCTS_PAGE_IDLE
                }`}
              >
                {item}
              </Link>
            ),
          )}
          <PaginationLink
            href={adminProductsHref(locale, filters, {
              page: Math.min(totalPages, filters.page + 1),
            })}
            disabled={filters.page === totalPages}
            label={common.next}
          />
        </nav>
        <form
          method="get"
          action={`/${locale}/admin/products`}
          className="flex flex-wrap items-end justify-center gap-2 sm:justify-end"
        >
          {filters.q ? <input type="hidden" name="q" value={filters.q} /> : null}
          {filters.sku ? <input type="hidden" name="sku" value={filters.sku} /> : null}
          {filters.categoryId ? (
            <input type="hidden" name="categoryId" value={filters.categoryId} />
          ) : null}
          {filters.stock !== "all" ? (
            <input type="hidden" name="stock" value={filters.stock} />
          ) : null}
          {filters.published !== "all" ? (
            <input type="hidden" name="published" value={filters.published} />
          ) : null}
          {filters.sort !== "created" ? (
            <input type="hidden" name="sort" value={filters.sort} />
          ) : null}
          {filters.dir !== "desc" ? (
            <input type="hidden" name="dir" value={filters.dir} />
          ) : null}
          <div className="flex min-w-[8rem] flex-col gap-1">
            <label
              htmlFor={goFieldId}
              className="text-xs font-semibold tracking-wide text-gray-500 uppercase"
            >
              {common.goToPageLabel}
            </label>
            <input
              id={goFieldId}
              type="number"
              inputMode="numeric"
              name="page"
              min={1}
              max={totalPages}
              key={filters.page}
              defaultValue={filters.page}
              placeholder={common.goToPagePlaceholder}
              aria-label={common.goToPageAria}
              className="h-10 w-24 rounded-lg border-2 border-gray-200 bg-white text-center text-sm font-medium tabular-nums shadow-sm focus:border-amber-500 focus:shadow-[0_0_0_3px_rgba(245,158,11,0.2)] focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="min-h-10 shrink-0 rounded-full bg-marco-slate px-4 text-sm font-medium text-white shadow-sm hover:brightness-95"
            aria-label={common.goToPageAria}
          >
            {common.goToPageButton}
          </button>
        </form>
      </div>
    </div>
  );
}

function PaginationLink({
  href,
  disabled,
  label,
}: {
  href: string;
  disabled: boolean;
  label: string;
}) {
  const className =
    "inline-flex min-h-10 min-w-[5.5rem] shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-marco-ink hover:bg-gray-100";
  if (disabled) {
    return (
      <span className={`${className} cursor-not-allowed border-gray-100 bg-gray-50 text-gray-400`}>
        {label}
      </span>
    );
  }
  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}
