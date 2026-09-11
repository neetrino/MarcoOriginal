"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  formatAdminMessage,
  getAdminCopy,
} from "@/features/admin/ui/get-admin-copy";
import {
  buildCategoryTree,
  collectExpandableIds,
  filterCategoryTree,
  type CategoryTreeNode,
} from "@/features/categories/domain/category-tree";
import type { DiscountBoardCategory } from "@/features/promotions/application/discounts-board";
import { saveCategoryDiscountsAction } from "@/features/promotions/application/manage-discounts";
import {
  draftsFromEndsAt,
  draftsFromStartsAt,
} from "@/features/promotions/domain/discount-ends-at";
import { CategoryDiscountTree } from "@/features/promotions/ui/CategoryDiscountTree";
import {
  DISCOUNT_EMPTY,
  DISCOUNT_GHOST_BUTTON,
  DISCOUNT_PRIMARY_BUTTON,
  DISCOUNT_SEARCH_FIELD,
  DISCOUNT_SECTION_CARD,
} from "@/features/promotions/ui/discount-admin.classes";
import { collectChangedDiscountRows } from "@/features/promotions/ui/discount-dirty";
import { draftsFromPercents } from "@/features/promotions/ui/discount-percent";
import { toDiscountScheduleCopy } from "@/features/promotions/ui/discount-schedule-copy";
import { useSyncedState } from "@/lib/react/sync-state-from-prop";

type CategoryDiscountsSectionProps = {
  locale: string;
  categories: DiscountBoardCategory[];
};

export function CategoryDiscountsSection({
  locale,
  categories,
}: CategoryDiscountsSectionProps) {
  const copy = getAdminCopy(locale).discounts;
  const common = getAdminCopy(locale).common;
  const categoriesCopy = getAdminCopy(locale).categories;
  const scheduleCopy = useMemo(
    () => toDiscountScheduleCopy(copy, common.clear),
    [copy, common.clear],
  );
  const router = useRouter();
  const sourceDrafts = useMemo(
    () => draftsFromPercents(categories),
    [categories],
  );
  const sourceStartsAt = useMemo(
    () => draftsFromStartsAt(categories),
    [categories],
  );
  const sourceEndsAt = useMemo(
    () => draftsFromEndsAt(categories),
    [categories],
  );
  const [drafts, setDrafts] = useSyncedState(sourceDrafts);
  const [startsAtDrafts, setStartsAtDrafts] = useSyncedState(sourceStartsAt);
  const [endsAtDrafts, setEndsAtDrafts] = useSyncedState(sourceEndsAt);
  const [query, setQuery] = useState("");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const tree = useMemo(() => buildCategoryTree(categories), [categories]);
  const needle = query.trim().toLowerCase();
  const visible = useMemo(
    () =>
      needle
        ? filterCategoryTree(tree, (node) =>
            node.title.toLowerCase().includes(needle),
          )
        : tree,
    [needle, tree],
  );
  const searchExpandedIds = useMemo(
    () => (needle ? collectExpandableIds(visible) : new Set<string>()),
    [needle, visible],
  );

  function saveAll(): void {
    const collected = collectChangedDiscountRows(
      categories,
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
      const result = await saveCategoryDiscountsAction(locale, {
        items: collected.changes.map((row) => ({
          categoryId: row.id,
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
        formatAdminMessage(copy.categorySaved, { count: result.value.saved }),
      );
      router.refresh();
    });
  }

  return (
    <section className={DISCOUNT_SECTION_CARD}>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-marco-ink">
            {copy.categoryTitle}
          </h2>
          <p className="text-sm text-gray-600">{copy.categorySubtitle}</p>
        </div>
        <button
          type="button"
          disabled={isPending || categories.length === 0}
          onClick={saveAll}
          className={DISCOUNT_PRIMARY_BUTTON}
        >
          {isPending ? common.saving : common.save}
        </button>
      </div>

      <div className="mb-4 flex gap-2">
        <label className="sr-only" htmlFor="category-discount-search">
          {categoriesCopy.searchLabel}
        </label>
        <input
          id="category-discount-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={categoriesCopy.searchPlaceholder}
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

      <CategoryList
        categories={categories}
        visible={visible}
        locale={locale}
        drafts={drafts}
        startsAtDrafts={startsAtDrafts}
        endsAtDrafts={endsAtDrafts}
        scheduleCopy={scheduleCopy}
        expandedIds={needle ? searchExpandedIds : expandedIds}
        isSearching={Boolean(needle)}
        disabled={isPending}
        emptyLabel={copy.categoryEmpty}
        noMatchLabel={categoriesCopy.noMatch}
        clearLabel={common.clear}
        discountForLabel={(name) =>
          formatAdminMessage(copy.discountFor, { name })
        }
        onToggle={(categoryId) =>
          setExpandedIds((current) => toggleId(current, categoryId))
        }
        onChange={(categoryId, value) =>
          setDrafts((prev) => ({ ...prev, [categoryId]: value }))
        }
        onScheduleChange={(categoryId, { startsAt, endsAt }) => {
          setStartsAtDrafts((prev) => ({ ...prev, [categoryId]: startsAt }));
          setEndsAtDrafts((prev) => ({ ...prev, [categoryId]: endsAt }));
        }}
        onClear={(categoryId) => {
          setDrafts((prev) => ({ ...prev, [categoryId]: "" }));
          setStartsAtDrafts((prev) => ({ ...prev, [categoryId]: "" }));
          setEndsAtDrafts((prev) => ({ ...prev, [categoryId]: "" }));
        }}
      />

      {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
      {message ? <p className="mt-3 text-sm text-green-700">{message}</p> : null}
    </section>
  );
}

function toggleId(current: Set<string>, id: string): Set<string> {
  const next = new Set(current);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  return next;
}

function CategoryList({
  categories,
  visible,
  locale,
  drafts,
  startsAtDrafts,
  endsAtDrafts,
  scheduleCopy,
  expandedIds,
  isSearching,
  disabled,
  emptyLabel,
  noMatchLabel,
  clearLabel,
  discountForLabel,
  onToggle,
  onChange,
  onScheduleChange,
  onClear,
}: {
  categories: DiscountBoardCategory[];
  visible: CategoryTreeNode<DiscountBoardCategory>[];
  locale: string;
  drafts: Record<string, string>;
  startsAtDrafts: Record<string, string>;
  endsAtDrafts: Record<string, string>;
  scheduleCopy: ReturnType<typeof toDiscountScheduleCopy>;
  expandedIds: ReadonlySet<string>;
  isSearching: boolean;
  disabled: boolean;
  emptyLabel: string;
  noMatchLabel: string;
  clearLabel: string;
  discountForLabel: (name: string) => string;
  onToggle: (categoryId: string) => void;
  onChange: (categoryId: string, value: string) => void;
  onScheduleChange: (
    categoryId: string,
    next: { startsAt: string; endsAt: string },
  ) => void;
  onClear: (categoryId: string) => void;
}) {
  if (categories.length === 0) {
    return <div className={DISCOUNT_EMPTY}>{emptyLabel}</div>;
  }
  if (visible.length === 0) {
    return <div className={DISCOUNT_EMPTY}>{noMatchLabel}</div>;
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <CategoryDiscountTree
        nodes={visible}
        locale={locale}
        drafts={drafts}
        startsAtDrafts={startsAtDrafts}
        endsAtDrafts={endsAtDrafts}
        scheduleCopy={scheduleCopy}
        expandedIds={expandedIds}
        isSearching={isSearching}
        disabled={disabled}
        discountForLabel={discountForLabel}
        clearLabel={clearLabel}
        onToggle={onToggle}
        onChange={onChange}
        onScheduleChange={onScheduleChange}
        onClear={onClear}
      />
    </div>
  );
}
