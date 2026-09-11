"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  formatAdminMessage,
  getAdminCopy,
} from "@/features/admin/ui/get-admin-copy";
import type { DiscountBoardBrand } from "@/features/promotions/application/discounts-board";
import { saveBrandDiscountsAction } from "@/features/promotions/application/manage-discounts";
import {
  draftsFromEndsAt,
  draftsFromStartsAt,
} from "@/features/promotions/domain/discount-ends-at";
import {
  DISCOUNT_EMPTY,
  DISCOUNT_FIELD,
  DISCOUNT_GHOST_BUTTON,
  DISCOUNT_PRIMARY_BUTTON,
  DISCOUNT_SEARCH_FIELD,
  DISCOUNT_SECTION_CARD,
  DISCOUNT_TREE_LIST,
  DISCOUNT_TREE_ROW,
} from "@/features/promotions/ui/discount-admin.classes";
import { collectChangedDiscountRows } from "@/features/promotions/ui/discount-dirty";
import { draftsFromPercents } from "@/features/promotions/ui/discount-percent";
import { DiscountScheduleField } from "@/features/promotions/ui/DiscountScheduleField";
import { toDiscountScheduleCopy } from "@/features/promotions/ui/discount-schedule-copy";
import { useSyncedState } from "@/lib/react/sync-state-from-prop";

type BrandDiscountsSectionProps = {
  locale: string;
  brands: DiscountBoardBrand[];
};

export function BrandDiscountsSection({
  locale,
  brands,
}: BrandDiscountsSectionProps) {
  const copy = getAdminCopy(locale).discounts;
  const common = getAdminCopy(locale).common;
  const brandsCopy = getAdminCopy(locale).brands;
  const scheduleCopy = useMemo(
    () => toDiscountScheduleCopy(copy, common.clear),
    [copy, common.clear],
  );
  const router = useRouter();
  const sourceDrafts = useMemo(() => draftsFromPercents(brands), [brands]);
  const sourceStartsAt = useMemo(() => draftsFromStartsAt(brands), [brands]);
  const sourceEndsAt = useMemo(() => draftsFromEndsAt(brands), [brands]);
  const [drafts, setDrafts] = useSyncedState(sourceDrafts);
  const [startsAtDrafts, setStartsAtDrafts] = useSyncedState(sourceStartsAt);
  const [endsAtDrafts, setEndsAtDrafts] = useSyncedState(sourceEndsAt);
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const visible = useMemo(
    () => filterDiscountBrands(brands, query),
    [brands, query],
  );

  function saveAll(): void {
    const collected = collectChangedDiscountRows(
      brands,
      drafts,
      startsAtDrafts,
      endsAtDrafts,
    );
    if (!collected.ok) {
      setError(
        formatAdminMessage(copy.invalidPercent, {
          name: collected.invalidTitle,
        }),
      );
      return;
    }
    if (collected.changes.length === 0) {
      setError(null);
      setMessage(null);
      return;
    }

    startTransition(async () => {
      setError(null);
      setMessage(null);
      const result = await saveBrandDiscountsAction(locale, {
        items: collected.changes.map((row) => ({
          brandId: row.id,
          percentage: row.percentage,
          startsAt: row.startsAt,
          endsAt: row.endsAt,
        })),
      });
      if (!result.ok) {
        setError(result.error.message);
        return;
      }
      setMessage(
        formatAdminMessage(copy.brandSaved, { count: result.value.saved }),
      );
      router.refresh();
    });
  }

  return (
    <section className={DISCOUNT_SECTION_CARD}>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-marco-ink">
            {copy.brandTitle}
          </h2>
          <p className="text-sm text-gray-600">{copy.brandSubtitle}</p>
        </div>
        <button
          type="button"
          disabled={isPending || brands.length === 0}
          onClick={saveAll}
          className={DISCOUNT_PRIMARY_BUTTON}
        >
          {isPending ? common.saving : common.save}
        </button>
      </div>

      <div className="mb-4 flex gap-2">
        <label className="sr-only" htmlFor="brand-discount-search">
          {brandsCopy.searchAria}
        </label>
        <input
          id="brand-discount-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={brandsCopy.searchPlaceholder}
          className={DISCOUNT_SEARCH_FIELD}
        />
        <button
          type="button"
          disabled={query.length === 0}
          onClick={() => setQuery("")}
          className={DISCOUNT_GHOST_BUTTON}
        >
          {common.clear}
        </button>
      </div>

      {brands.length === 0 ? (
        <div className={DISCOUNT_EMPTY}>{copy.brandEmpty}</div>
      ) : visible.length === 0 ? (
        <div className={DISCOUNT_EMPTY}>{brandsCopy.noMatch}</div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col">
          <div className={DISCOUNT_TREE_LIST}>
            {visible.map((brand) => (
              <div key={brand.id} className={DISCOUNT_TREE_ROW}>
                <p className="min-w-0 flex-1 truncate text-sm font-semibold uppercase text-marco-ink">
                  {brand.title}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <label className="sr-only" htmlFor={`brand-discount-${brand.id}`}>
                    {formatAdminMessage(copy.discountFor, { name: brand.title })}
                  </label>
                  <input
                    id={`brand-discount-${brand.id}`}
                    type="number"
                    min={0}
                    max={100}
                    inputMode="numeric"
                    disabled={isPending}
                    value={drafts[brand.id] ?? ""}
                    onChange={(event) =>
                      setDrafts((prev) => ({
                        ...prev,
                        [brand.id]: event.target.value,
                      }))
                    }
                    className={DISCOUNT_FIELD}
                  />
                  <span className="text-sm font-semibold text-marco-slate">%</span>
                  <DiscountScheduleField
                    id={`brand-discount-schedule-${brand.id}`}
                    locale={locale}
                    copy={scheduleCopy}
                    startsAt={startsAtDrafts[brand.id] ?? ""}
                    endsAt={endsAtDrafts[brand.id] ?? ""}
                    disabled={isPending}
                    onChange={({ startsAt, endsAt }) => {
                      setStartsAtDrafts((prev) => ({
                        ...prev,
                        [brand.id]: startsAt,
                      }));
                      setEndsAtDrafts((prev) => ({
                        ...prev,
                        [brand.id]: endsAt,
                      }));
                    }}
                  />
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => {
                      setDrafts((prev) => ({ ...prev, [brand.id]: "" }));
                      setStartsAtDrafts((prev) => ({ ...prev, [brand.id]: "" }));
                      setEndsAtDrafts((prev) => ({ ...prev, [brand.id]: "" }));
                    }}
                    className={DISCOUNT_GHOST_BUTTON}
                  >
                    {common.clear}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
      {message ? <p className="mt-3 text-sm text-green-700">{message}</p> : null}
    </section>
  );
}

function filterDiscountBrands(
  brands: DiscountBoardBrand[],
  query: string,
): DiscountBoardBrand[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return brands;
  return brands.filter(
    (brand) =>
      brand.title.toLowerCase().includes(needle) ||
      brand.sku.toLowerCase().includes(needle),
  );
}
