"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Card } from "@/components/ui/Card";
import {
  ConfirmDialog,
  deleteConfirmDescription,
} from "@/components/ui/ConfirmDialog";
import {
  deleteCategoryAction,
  reorderCategoriesAction,
} from "@/features/categories/actions";
import type { AdminCategoryListItem } from "@/features/categories/application/list-admin-categories";
import {
  buildCategoryTree,
  collectExpandableIds,
  filterCategoryTree,
} from "@/features/categories/domain/category-tree";
import { AddCategoryDrawer } from "@/features/categories/ui/AddCategoryDrawer";
import { AdminCategoriesToolbar } from "@/features/categories/ui/AdminCategoriesToolbar";
import { AdminCategoryTreeNode } from "@/features/categories/ui/AdminCategoryTreeNode";
import { useSyncedState } from "@/lib/react/sync-state-from-prop";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

type CategoriesCopy = Dictionary["admin"]["categories"];

type AdminCategoriesViewProps = {
  locale: string;
  categories: AdminCategoryListItem[];
  copy: CategoriesCopy;
};

type DrawerState = {
  category: AdminCategoryListItem | null;
  requireParent: boolean;
  parentId: string;
};

function moveItem<T>(list: T[], fromIndex: number, toIndex: number): T[] {
  if (
    fromIndex === toIndex ||
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= list.length ||
    toIndex >= list.length
  ) {
    return list;
  }
  const next = [...list];
  const [item] = next.splice(fromIndex, 1);
  if (!item) return list;
  next.splice(toIndex, 0, item);
  return next;
}

function sameOrder(
  left: AdminCategoryListItem[],
  right: AdminCategoryListItem[],
): boolean {
  if (left.length !== right.length) return false;
  return left.every((item, index) => item.id === right[index]?.id);
}

export function AdminCategoriesView({
  locale,
  categories,
  copy,
}: AdminCategoriesViewProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [drawer, setDrawer] = useState<DrawerState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [pendingDelete, setPendingDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [ordered, setOrdered] = useSyncedState(categories);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const orderedRef = useRef(ordered);
  const dragOriginRef = useRef<AdminCategoryListItem[] | null>(null);
  const persistedRef = useRef(false);

  useEffect(() => {
    orderedRef.current = ordered;
  }, [ordered]);

  const needle = query.trim().toLowerCase();
  const isFiltering = needle.length > 0;
  const tree = useMemo(() => {
    const forest = buildCategoryTree(ordered);
    if (!isFiltering) return forest;
    return filterCategoryTree(
      forest,
      (node) =>
        node.title.toLowerCase().includes(needle) ||
        node.slug.toLowerCase().includes(needle),
    );
  }, [ordered, isFiltering, needle]);
  const visibleExpanded = isFiltering
    ? collectExpandableIds(tree)
    : expandedIds;

  function persistCurrentOrder(): void {
    if (persistedRef.current) return;
    const next = orderedRef.current;
    const previous = dragOriginRef.current;
    dragOriginRef.current = null;
    if (!previous || sameOrder(previous, next)) return;

    persistedRef.current = true;
    startTransition(async () => {
      setError(null);
      const result = await reorderCategoriesAction(locale, {
        orderedIds: next.map((category) => category.id),
      });
      if (!result.ok) {
        setOrdered(previous);
        orderedRef.current = previous;
        setError(result.error.message);
        return;
      }
      router.refresh();
    });
  }

  function reorderToward(targetId: string): void {
    if (!draggingId || isFiltering || draggingId === targetId) return;
    setOrdered((current) => {
      const fromIndex = current.findIndex((item) => item.id === draggingId);
      const toIndex = current.findIndex((item) => item.id === targetId);
      const from = current[fromIndex];
      const to = current[toIndex];
      if (
        fromIndex < 0 ||
        toIndex < 0 ||
        !from ||
        !to ||
        from.parentId !== to.parentId
      ) {
        return current;
      }
      const next = moveItem(current, fromIndex, toIndex);
      orderedRef.current = next;
      return next;
    });
  }

  function confirmDelete(): void {
    if (!pendingDelete) return;
    const categoryId = pendingDelete.id;
    startTransition(async () => {
      setError(null);
      const result = await deleteCategoryAction(locale, categoryId);
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
      <AdminCategoriesToolbar
        copy={copy}
        query={query}
        onQueryChange={setQuery}
        onAddCategory={() =>
          setDrawer({ category: null, requireParent: false, parentId: "" })
        }
        onAddSubcategory={() =>
          setDrawer({ category: null, requireParent: true, parentId: "" })
        }
      />

      {isFiltering ? (
        <p className="mb-3 text-xs text-gray-500">{copy.reorderHint}</p>
      ) : null}
      {error ? <p className="mb-3 text-sm text-red-700">{error}</p> : null}

      <Card className="p-4">
        {tree.length === 0 ? (
          <p className="text-sm text-gray-600">
            {categories.length === 0 ? copy.empty : copy.noMatch}
          </p>
        ) : (
          <div className="space-y-3">
            <div className="hidden grid-cols-[auto_auto_minmax(0,1fr)_auto_auto] items-center gap-3 px-3 text-[11px] font-semibold tracking-wide text-gray-500 uppercase sm:grid">
              <span className="w-4" />
              <span>{copy.columnImage}</span>
              <span>{copy.columnTitle}</span>
              <span className="text-center">{copy.columnChildren}</span>
              <span className="text-center">{copy.columnActions}</span>
            </div>
            {tree.map((node) => (
              <AdminCategoryTreeNode
                key={node.id}
                node={node}
                handlers={{
                  copy,
                  expandedIds: visibleExpanded,
                  draggingId,
                  isFiltering,
                  isPending,
                  onToggle: (id) =>
                    setExpandedIds((current) => {
                      const next = new Set(current);
                      if (next.has(id)) next.delete(id);
                      else next.add(id);
                      return next;
                    }),
                  onDragStart: (id) => {
                    dragOriginRef.current = orderedRef.current;
                    persistedRef.current = false;
                    setDraggingId(id);
                  },
                  onDragOver: reorderToward,
                  onDrop: () => {
                    persistCurrentOrder();
                    setDraggingId(null);
                  },
                  onDragEnd: () => {
                    persistCurrentOrder();
                    setDraggingId(null);
                  },
                  onEdit: (item) =>
                    setDrawer({
                      category: item,
                      requireParent: false,
                      parentId: item.parentId ?? "",
                    }),
                  onAddChild: (parentId) => {
                    setExpandedIds((current) => new Set(current).add(parentId));
                    setDrawer({
                      category: null,
                      requireParent: true,
                      parentId,
                    });
                  },
                  onDelete: (id, title) => setPendingDelete({ id, title }),
                }}
              />
            ))}
          </div>
        )}
      </Card>

      <AddCategoryDrawer
        locale={locale}
        open={drawer !== null}
        onClose={() => setDrawer(null)}
        categories={categories}
        copy={copy}
        category={drawer?.category ?? null}
        requireParent={drawer?.requireParent ?? false}
        defaultParentId={drawer?.parentId ?? ""}
      />

      <ConfirmDialog
        open={pendingDelete !== null}
        title={copy.deleteTitle}
        description={
          pendingDelete
            ? deleteConfirmDescription(copy.entity, pendingDelete.title)
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
