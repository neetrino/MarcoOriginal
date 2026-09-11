"use client";

import { ChevronRight } from "lucide-react";

import type { CategoryTreeNode } from "@/features/categories/domain/category-tree";
import type { DiscountBoardCategory } from "@/features/promotions/application/discounts-board";
import {
  DiscountScheduleField,
  type DiscountScheduleCopy,
} from "@/features/promotions/ui/DiscountScheduleField";
import {
  DISCOUNT_FIELD,
  DISCOUNT_GHOST_BUTTON,
  DISCOUNT_TREE_LIST,
  DISCOUNT_TREE_ROW,
} from "@/features/promotions/ui/discount-admin.classes";

const INDENT_PER_LEVEL_PX = 16;

type CategoryDiscountEditorProps = {
  locale: string;
  drafts: Record<string, string>;
  startsAtDrafts: Record<string, string>;
  endsAtDrafts: Record<string, string>;
  scheduleCopy: DiscountScheduleCopy;
  expandedIds: ReadonlySet<string>;
  isSearching: boolean;
  disabled: boolean;
  discountForLabel: (name: string) => string;
  clearLabel: string;
  onToggle: (categoryId: string) => void;
  onChange: (categoryId: string, value: string) => void;
  onScheduleChange: (
    categoryId: string,
    next: { startsAt: string; endsAt: string },
  ) => void;
  onClear: (categoryId: string) => void;
};

type CategoryDiscountTreeProps = CategoryDiscountEditorProps & {
  nodes: CategoryTreeNode<DiscountBoardCategory>[];
};

export function CategoryDiscountTree({
  nodes,
  locale,
  drafts,
  startsAtDrafts,
  endsAtDrafts,
  scheduleCopy,
  expandedIds,
  isSearching,
  disabled,
  discountForLabel,
  clearLabel,
  onToggle,
  onChange,
  onScheduleChange,
  onClear,
}: CategoryDiscountTreeProps) {
  return (
    <div className={DISCOUNT_TREE_LIST}>
      {nodes.map((node) => (
        <CategoryDiscountNode
          key={node.id}
          node={node}
          depth={0}
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
      ))}
    </div>
  );
}

function CategoryDiscountNode({
  node,
  depth,
  locale,
  drafts,
  startsAtDrafts,
  endsAtDrafts,
  scheduleCopy,
  expandedIds,
  isSearching,
  disabled,
  discountForLabel,
  clearLabel,
  onToggle,
  onChange,
  onScheduleChange,
  onClear,
}: CategoryDiscountEditorProps & {
  node: CategoryTreeNode<DiscountBoardCategory>;
  depth: number;
}) {
  const hasChildren = node.children.length > 0;
  const expanded = hasChildren && (isSearching || expandedIds.has(node.id));
  const canToggle = hasChildren && !isSearching;
  const titleClass =
    depth === 0
      ? "truncate text-sm font-semibold text-marco-ink"
      : "truncate text-xs font-medium text-marco-slate";

  return (
    <div>
      <div
        className={`${DISCOUNT_TREE_ROW} ${canToggle ? "cursor-pointer" : ""}`}
        style={{ marginLeft: `${depth * INDENT_PER_LEVEL_PX}px` }}
        onClick={canToggle ? () => onToggle(node.id) : undefined}
      >
        <TreeToggle expanded={expanded} visible={canToggle} />
        <p className={`min-w-0 flex-1 ${titleClass}`}>{node.title}</p>
        <DiscountPercentField
          id={`cat-discount-${node.id}`}
          locale={locale}
          label={discountForLabel(node.title)}
          value={drafts[node.id] ?? ""}
          scheduleId={`cat-discount-schedule-${node.id}`}
          scheduleCopy={scheduleCopy}
          startsAt={startsAtDrafts[node.id] ?? ""}
          endsAt={endsAtDrafts[node.id] ?? ""}
          disabled={disabled}
          clearLabel={clearLabel}
          onChange={(value) => onChange(node.id, value)}
          onScheduleChange={(next) => onScheduleChange(node.id, next)}
          onClear={() => onClear(node.id)}
        />
      </div>
      {hasChildren && expanded
        ? node.children.map((child) => (
            <CategoryDiscountNode
              key={child.id}
              node={child}
              depth={depth + 1}
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
          ))
        : null}
    </div>
  );
}

function TreeToggle({
  expanded,
  visible,
}: {
  expanded: boolean;
  visible: boolean;
}) {
  if (!visible) {
    return <span className="h-8 w-8 shrink-0" aria-hidden />;
  }

  return (
    <span
      className="flex h-8 w-8 shrink-0 items-center justify-center text-gray-500"
      aria-hidden
    >
      <ChevronRight
        className={`h-4 w-4 transition-transform ${expanded ? "rotate-90" : ""}`}
      />
    </span>
  );
}

function DiscountPercentField({
  id,
  locale,
  label,
  value,
  scheduleId,
  scheduleCopy,
  startsAt,
  endsAt,
  disabled,
  clearLabel,
  onChange,
  onScheduleChange,
  onClear,
}: {
  id: string;
  locale: string;
  label: string;
  value: string;
  scheduleId: string;
  scheduleCopy: DiscountScheduleCopy;
  startsAt: string;
  endsAt: string;
  disabled: boolean;
  clearLabel: string;
  onChange: (value: string) => void;
  onScheduleChange: (next: { startsAt: string; endsAt: string }) => void;
  onClear: () => void;
}) {
  return (
    <div
      className="flex flex-wrap items-center gap-2"
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
    >
      <label className="sr-only" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type="number"
        min={0}
        max={100}
        inputMode="numeric"
        disabled={disabled}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={DISCOUNT_FIELD}
      />
      <span className="text-sm font-semibold text-marco-slate">%</span>
      <DiscountScheduleField
        id={scheduleId}
        locale={locale}
        copy={scheduleCopy}
        startsAt={startsAt}
        endsAt={endsAt}
        disabled={disabled}
        onChange={onScheduleChange}
      />
      <button
        type="button"
        disabled={disabled}
        onClick={onClear}
        className={DISCOUNT_GHOST_BUTTON}
      >
        {clearLabel}
      </button>
    </div>
  );
}
