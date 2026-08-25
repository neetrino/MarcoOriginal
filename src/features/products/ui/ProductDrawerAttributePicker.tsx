"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";

import { ADMIN_INPUT, ADMIN_LABEL } from "@/features/admin/ui/admin-form-classes";
import type { AdminAttributeListItem } from "@/features/attributes/domain/attribute-admin-model";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

type EditorCopy = Dictionary["admin"]["productEditor"];

type ProductDrawerAttributePickerProps = {
  copy: EditorCopy;
  attributes: readonly AdminAttributeListItem[];
  selectedIds: readonly string[];
  disabled: boolean;
  onChange: (ids: string[]) => void;
};

function toggleId(ids: readonly string[], id: string): string[] {
  return ids.includes(id) ? ids.filter((entry) => entry !== id) : [...ids, id];
}

export function ProductDrawerAttributePicker({
  copy,
  attributes,
  selectedIds,
  disabled,
  onChange,
}: ProductDrawerAttributePickerProps) {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(selectedIds.length === 0);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return attributes;
    return attributes.filter(
      (attribute) =>
        attribute.title.toLowerCase().includes(normalized) ||
        attribute.key.toLowerCase().includes(normalized) ||
        attribute.values.some((value) =>
          value.title.toLowerCase().includes(normalized),
        ),
    );
  }, [attributes, query]);

  const selectedAttributes = attributes.filter((attribute) =>
    selectedIds.includes(attribute.id),
  );

  return (
    <section className="flex flex-col gap-4">
      <div>
        <span className={ADMIN_LABEL}>{copy.variableAttributesTitle}</span>
        <div className="relative mt-1.5">
          <Search
            className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden
          />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={copy.variableAttributesSearch}
            className={`${ADMIN_INPUT} pl-11 pr-12`}
            disabled={disabled}
          />
          <button
            type="button"
            aria-expanded={expanded}
            aria-label={expanded ? copy.variableAttributesCollapse : copy.variableAttributesExpand}
            disabled={disabled}
            onClick={() => setExpanded((value) => !value)}
            className="absolute top-1/2 right-3 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100"
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`}
              aria-hidden
            />
          </button>
        </div>
      </div>

      {selectedAttributes.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {selectedAttributes.map((attribute) => (
            <span
              key={attribute.id}
              className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700"
            >
              {attribute.title}
              <button
                type="button"
                aria-label={copy.variableRemoveAttribute}
                disabled={disabled}
                onClick={() => onChange(selectedIds.filter((id) => id !== attribute.id))}
                className="rounded-full p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-3.5 w-3.5" aria-hidden />
              </button>
            </span>
          ))}
        </div>
      ) : null}

      {expanded ? (
        <div className="max-h-72 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          {filtered.length === 0 ? (
            <p className="text-sm text-slate-400">{copy.variableAttributesEmpty}</p>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
              {filtered.map((attribute) => {
                const selected = selectedIds.includes(attribute.id);
                return (
                  <label
                    key={attribute.id}
                    className="flex cursor-pointer items-center gap-2 rounded-xl px-2 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      disabled={disabled}
                      onChange={() => onChange(toggleId(selectedIds, attribute.id))}
                      className="h-4 w-4 rounded border-slate-300 text-marco-slate focus:ring-marco-slate/20"
                    />
                    <span>{attribute.title}</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      ) : null}
    </section>
  );
}
