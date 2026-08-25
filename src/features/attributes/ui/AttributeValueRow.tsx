"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronDown, X } from "lucide-react";

import { ADMIN_LABEL } from "@/features/admin/ui/admin-form-classes";
import type { AdminAttributeValue } from "@/features/attributes/domain/attribute-admin-model";
import { AttributeValueSwatch } from "@/features/attributes/ui/AttributeValueSwatch";
import type { AdminAttributesCopy } from "@/features/attributes/ui/admin-attributes-copy";
import {
  addAttributeValueImageAction,
  deleteAttributeValueAction,
  removeAttributeValueImageAction,
  updateAttributeValueColorAction,
} from "@/features/attributes/value-actions";

const DEFAULT_COLOR = "#000000";

type AttributeValueRowProps = {
  locale: string;
  value: AdminAttributeValue;
  copy: AdminAttributesCopy;
  disabled: boolean;
  onError: (message: string | null) => void;
};

export function AttributeValueRow({
  locale,
  value,
  copy,
  disabled,
  onError,
}: AttributeValueRowProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [isPending, startTransition] = useTransition();
  const busy = disabled || isPending;
  const pickerColor = value.colorHex ?? DEFAULT_COLOR;

  function run(
    action: () => Promise<{ ok: true } | { ok: false; error: { message: string } }>,
  ): void {
    startTransition(async () => {
      onError(null);
      const result = await action();
      if (!result.ok) {
        onError(result.error.message);
        return;
      }
      router.refresh();
    });
  }

  return (
    <li className="rounded-2xl border border-gray-200 bg-white">
      <div className="flex items-center gap-3 px-3 py-2.5">
        <AttributeValueSwatch value={value} />
        <span className="min-w-0 flex-1 truncate text-sm font-medium text-gray-900">
          {value.title}
        </span>
        <button
          type="button"
          aria-expanded={expanded}
          aria-label={expanded ? copy.collapseValue : copy.expandValue}
          onClick={() => setExpanded((prev) => !prev)}
          className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
        >
          <ChevronDown
            className={`h-4 w-4 transition-transform ${expanded ? "" : "-rotate-90"}`}
          />
        </button>
        <button
          type="button"
          disabled={busy}
          aria-label={`${copy.removeValue} ${value.title}`}
          onClick={() =>
            run(() => deleteAttributeValueAction(locale, value.id))
          }
          className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {expanded ? (
        <div className="grid gap-4 border-t border-gray-100 px-3 py-4 md:grid-cols-2">
          <div>
            <p className={ADMIN_LABEL}>{copy.colors}</p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <label className="inline-flex cursor-pointer items-center">
                <span className="sr-only">{copy.addColor}</span>
                <input
                  type="color"
                  value={pickerColor}
                  disabled={busy}
                  onChange={(event) => {
                    const hex = event.target.value.toUpperCase();
                    run(() =>
                      updateAttributeValueColorAction(locale, value.id, hex),
                    );
                  }}
                  className="sr-only"
                />
                <span
                  aria-hidden
                  className="h-11 w-11 rounded-xl border border-gray-200"
                  style={{ backgroundColor: pickerColor }}
                />
              </label>
              {value.colorHex ? (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() =>
                    run(() =>
                      updateAttributeValueColorAction(locale, value.id, null),
                    )
                  }
                  className="text-sm font-medium text-gray-600 hover:text-red-600"
                >
                  {copy.removeValue}
                </button>
              ) : (
                <span className="text-sm text-gray-500">{copy.addColor}</span>
              )}
            </div>
          </div>

          <div>
            <p className={ADMIN_LABEL}>{copy.image}</p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                disabled={busy}
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50 disabled:opacity-50"
              >
                {value.imageUrl ? copy.changeImage : copy.uploadImage}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                disabled={busy}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  event.target.value = "";
                  if (!file) return;
                  const formData = new FormData();
                  formData.set("image", file);
                  run(() =>
                    addAttributeValueImageAction(locale, value.id, formData),
                  );
                }}
              />
              {value.imageUrl ? (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() =>
                    run(() =>
                      removeAttributeValueImageAction(locale, value.id),
                    )
                  }
                  className="text-sm font-medium text-gray-600 hover:text-red-600"
                >
                  {copy.removeImage}
                </button>
              ) : null}
            </div>
            {value.imageUrl ? (
              <div className="relative mt-3 h-20 w-20 overflow-hidden rounded-xl border border-gray-200">
                <Image
                  src={value.imageUrl}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </li>
  );
}

