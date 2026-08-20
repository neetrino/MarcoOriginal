"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

import {
  ADMIN_INPUT,
  ADMIN_LABEL,
  ADMIN_SELECT,
} from "@/features/admin/ui/admin-form-classes";
import type { ProductTag } from "@/features/products/domain/product-presentation";
import { HEX_COLOR_PATTERN } from "@/features/products/domain/product-presentation";

type TagEditorCopy = {
  tagCard: string;
  tagType: string;
  tagTypeText: string;
  tagTypePercent: string;
  tagValue: string;
  tagValuePlaceholder: string;
  tagPercentPlaceholder: string;
  tagColor: string;
  tagColorPlaceholder: string;
  tagColorEmpty: string;
  removeTag: string;
};

type ProductDrawerTagCardProps = {
  index: number;
  tag: ProductTag;
  disabled: boolean;
  copy: TagEditorCopy;
  onChange: (tag: ProductTag) => void;
  onRemove: () => void;
};

export function ProductDrawerTagCard({
  index,
  tag,
  disabled,
  copy,
  onChange,
  onRemove,
}: ProductDrawerTagCardProps) {
  const [hexDraft, setHexDraft] = useState(tag.color ?? "");
  const [prevColor, setPrevColor] = useState(tag.color);
  const colorValue = tag.color ?? "#FFCA03";

  if (tag.color !== prevColor) {
    setPrevColor(tag.color);
    setHexDraft(tag.color ?? "");
  }

  function commitHex(raw: string): void {
    const next = raw.trim();
    if (!next) {
      onChange({ ...tag, color: null });
      return;
    }
    const hex = next.startsWith("#") ? next : `#${next}`;
    if (HEX_COLOR_PATTERN.test(hex)) {
      onChange({ ...tag, color: hex.toUpperCase() });
      return;
    }
    setHexDraft(tag.color ?? "");
  }

  return (
    <article className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
          {copy.tagCard.replace("{index}", String(index + 1))}
        </h4>
        <button
          type="button"
          onClick={onRemove}
          disabled={disabled}
          aria-label={copy.removeTag}
          className="rounded-lg p-1.5 text-red-500 transition-colors hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" aria-hidden />
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label>
          <span className={ADMIN_LABEL}>{copy.tagType}</span>
          <select
            value={tag.type}
            disabled={disabled}
            onChange={(event) =>
              onChange({
                ...tag,
                type: event.target.value === "PERCENT" ? "PERCENT" : "TEXT",
                value: "",
              })
            }
            className={ADMIN_SELECT}
          >
            <option value="TEXT">{copy.tagTypeText}</option>
            <option value="PERCENT">{copy.tagTypePercent}</option>
          </select>
        </label>

        <label>
          <span className={ADMIN_LABEL}>{copy.tagValue}</span>
          <input
            value={tag.value}
            disabled={disabled}
            inputMode={tag.type === "PERCENT" ? "numeric" : "text"}
            maxLength={tag.type === "PERCENT" ? 2 : 40}
            placeholder={
              tag.type === "PERCENT"
                ? copy.tagPercentPlaceholder
                : copy.tagValuePlaceholder
            }
            onChange={(event) =>
              onChange({ ...tag, value: event.target.value })
            }
            className={ADMIN_INPUT}
          />
        </label>

        <label>
          <span className={ADMIN_LABEL}>{copy.tagColor}</span>
          <input
            value={hexDraft}
            disabled={disabled}
            placeholder={copy.tagColorPlaceholder}
            onChange={(event) => setHexDraft(event.target.value)}
            onBlur={(event) => commitHex(event.target.value)}
            className={ADMIN_INPUT}
          />
        </label>

        <div className="flex items-end gap-3">
          <label className="flex cursor-pointer items-center gap-3">
            <span className="sr-only">{copy.tagColor}</span>
            <input
              type="color"
              disabled={disabled}
              value={colorValue}
              onChange={(event) =>
                onChange({ ...tag, color: event.target.value.toUpperCase() })
              }
              className="sr-only"
            />
            <span
              aria-hidden
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-dashed border-slate-300"
              style={
                tag.color
                  ? { backgroundColor: tag.color, borderStyle: "solid" }
                  : undefined
              }
            />
            <span className="text-sm text-slate-400">
              {tag.color ?? copy.tagColorEmpty}
            </span>
          </label>
        </div>
      </div>
    </article>
  );
}
