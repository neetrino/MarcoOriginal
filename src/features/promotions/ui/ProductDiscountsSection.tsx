"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  formatAdminMessage,
  getAdminCopy,
} from "@/features/admin/ui/get-admin-copy";
import type { DiscountBoardProduct } from "@/features/promotions/application/discounts-board";
import { upsertTargetDiscountAction } from "@/features/promotions/application/manage-discounts";
import { ProductDiscountRow } from "@/features/promotions/ui/ProductDiscountRow";
import {
  DISCOUNT_EMPTY,
  DISCOUNT_GHOST_BUTTON,
  DISCOUNT_SEARCH_FIELD,
  DISCOUNT_SECTION_CARD,
} from "@/features/promotions/ui/discount-admin.classes";
import {
  draftsFromPercents,
  parseDiscountPercent,
} from "@/features/promotions/ui/discount-percent";
import { paginateDiscountItems } from "@/features/promotions/ui/discount-product-page";
import { useSyncedState } from "@/lib/react/sync-state-from-prop";

type ProductDiscountsSectionProps = {
  locale: string;
  products: DiscountBoardProduct[];
};

export function ProductDiscountsSection({
  locale,
  products,
}: ProductDiscountsSectionProps) {
  const copy = getAdminCopy(locale).discounts;
  const common = getAdminCopy(locale).common;
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const sourceDrafts = useMemo(() => draftsFromPercents(products), [products]);
  const [drafts, setDrafts] = useSyncedState(sourceDrafts);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(
    () => filterDiscountProducts(products, query),
    [products, query],
  );
  const paged = paginateDiscountItems(filtered, page);

  function saveOne(productId: string, title: string): void {
    const parsed = parseDiscountPercent(drafts[productId] ?? "");
    if (parsed === "invalid") {
      setError(formatAdminMessage(copy.invalidPercent, { name: title }));
      return;
    }

    setSavingId(productId);
    startTransition(async () => {
      setError(null);
      setMessage(null);
      const result = await upsertTargetDiscountAction(locale, {
        target: "product",
        targetId: productId,
        percentage: parsed,
      });
      setSavingId(null);
      if (!result.ok) {
        setError(result.error.message);
        return;
      }
      setMessage(
        parsed == null
          ? formatAdminMessage(copy.productCleared, { name: title })
          : formatAdminMessage(copy.productSaved, {
              percent: parsed,
              name: title,
            }),
      );
      router.refresh();
    });
  }

  return (
    <section className={DISCOUNT_SECTION_CARD}>
      <div className="mb-6">
        <h2 className="mb-2 text-lg font-semibold tracking-tight text-marco-ink">
          {copy.productTitle}
        </h2>
        <p className="text-sm text-gray-600">{copy.productSubtitle}</p>
      </div>

      <div className="mb-4 flex gap-2">
        <label className="sr-only" htmlFor="product-discount-search">
          {copy.productSearch}
        </label>
        <input
          id="product-discount-search"
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setPage(1);
          }}
          placeholder={copy.productSearchPlaceholder}
          className={DISCOUNT_SEARCH_FIELD}
        />
        <button
          type="button"
          disabled={query.length === 0}
          onClick={() => {
            setQuery("");
            setPage(1);
          }}
          className={DISCOUNT_GHOST_BUTTON}
        >
          {common.clear}
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className={DISCOUNT_EMPTY}>{copy.productEmpty}</div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col">
          <ul className="min-h-0 flex-1 space-y-3 overflow-y-auto">
            {paged.items.map((product) => (
              <ProductDiscountRow
                key={product.id}
                product={product}
                locale={locale}
                draft={drafts[product.id] ?? ""}
                busy={isPending && savingId === product.id}
                disabled={isPending}
                discountForLabel={formatAdminMessage(copy.discountFor, {
                  name: product.title,
                })}
                saveLabel={
                  isPending && savingId === product.id
                    ? common.saving
                    : common.save
                }
                onChange={(value) =>
                  setDrafts((prev) => ({ ...prev, [product.id]: value }))
                }
                onSave={() => saveOne(product.id, product.title)}
              />
            ))}
          </ul>
          <DiscountProductPager
            page={paged.page}
            totalPages={paged.totalPages}
            total={filtered.length}
            previousLabel={common.previous}
            nextLabel={common.next}
            pageLabel={formatAdminMessage(common.showingPage, {
              page: paged.page,
              totalPages: paged.totalPages,
              total: filtered.length,
            })}
            onPageChange={setPage}
          />
        </div>
      )}

      {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
      {message ? <p className="mt-3 text-sm text-green-700">{message}</p> : null}
    </section>
  );
}

function filterDiscountProducts(
  products: DiscountBoardProduct[],
  query: string,
): DiscountBoardProduct[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return products;
  return products.filter(
    (product) =>
      product.title.toLowerCase().includes(needle) ||
      product.slug.toLowerCase().includes(needle) ||
      product.sku.toLowerCase().includes(needle),
  );
}

function DiscountProductPager({
  page,
  totalPages,
  total,
  previousLabel,
  nextLabel,
  pageLabel,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  total: number;
  previousLabel: string;
  nextLabel: string;
  pageLabel: string;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1 || total === 0) return null;

  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
      <p className="text-sm text-marco-slate/70">{pageLabel}</p>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className={DISCOUNT_GHOST_BUTTON}
        >
          {previousLabel}
        </button>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className={DISCOUNT_GHOST_BUTTON}
        >
          {nextLabel}
        </button>
      </div>
    </div>
  );
}
