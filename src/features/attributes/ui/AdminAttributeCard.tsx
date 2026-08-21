"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Pencil, Trash2 } from "lucide-react";

import { ADMIN_INPUT } from "@/features/admin/ui/admin-form-classes";
import type { AdminAttributeListItem } from "@/features/attributes/domain/attribute-admin-model";
import type { AdminAttributesCopy } from "@/features/attributes/ui/admin-attributes-copy";
import { AttributeValueRow } from "@/features/attributes/ui/AttributeValueRow";
import { addAttributeValueAction } from "@/features/attributes/value-actions";

type AdminAttributeCardProps = {
  locale: string;
  attribute: AdminAttributeListItem;
  copy: AdminAttributesCopy;
  expanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  disabled: boolean;
  onError: (message: string | null) => void;
};

export function AdminAttributeCard({
  locale,
  attribute,
  copy,
  expanded,
  onToggle,
  onEdit,
  onDelete,
  disabled,
  onError,
}: AdminAttributeCardProps) {
  const router = useRouter();
  const [draft, setDraft] = useState("");
  const [isPending, startTransition] = useTransition();
  const busy = disabled || isPending;
  const valueCount = copy.valueCount.replace(
    "{count}",
    String(attribute.values.length),
  );

  function addValue(): void {
    const title = draft.trim();
    if (!title) return;

    startTransition(async () => {
      onError(null);
      const result = await addAttributeValueAction(
        locale,
        attribute.id,
        title,
      );
      if (!result.ok) {
        onError(result.error.message);
        return;
      }
      setDraft("");
      router.refresh();
    });
  }

  return (
    <article className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center gap-2 px-3 py-3 sm:px-4">
        <button
          type="button"
          aria-expanded={expanded}
          aria-label={expanded ? copy.collapse : copy.expand}
          onClick={onToggle}
          className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
        >
          <ChevronDown
            className={`h-5 w-5 transition-transform ${expanded ? "" : "-rotate-90"}`}
          />
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate text-base font-semibold text-gray-900">
              {attribute.title}
            </h2>
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
              {attribute.key}
            </span>
          </div>
          <p className="text-sm text-gray-500">{valueCount}</p>
        </div>
        <button
          type="button"
          className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
          aria-label={`${copy.edit} ${attribute.title}`}
          onClick={onEdit}
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          type="button"
          disabled={busy}
          className="rounded p-1.5 text-red-600 hover:bg-red-50 disabled:opacity-50"
          aria-label={`${copy.delete} ${attribute.title}`}
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {expanded ? (
        <div className="space-y-3 border-t border-gray-100 px-3 py-4 sm:px-4">
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={copy.addValuePlaceholder}
              className={ADMIN_INPUT}
              disabled={busy}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addValue();
                }
              }}
            />
            <button
              type="button"
              disabled={busy || !draft.trim()}
              onClick={addValue}
              className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-marco-slate px-4 text-sm font-medium text-white transition-[filter] hover:brightness-95 disabled:opacity-50"
            >
              {isPending ? copy.adding : copy.addValue}
            </button>
          </div>

          {attribute.values.length > 0 ? (
            <ul className="space-y-2">
              {attribute.values.map((value) => (
                <AttributeValueRow
                  key={value.id}
                  locale={locale}
                  value={value}
                  copy={copy}
                  disabled={busy}
                  onError={onError}
                />
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
