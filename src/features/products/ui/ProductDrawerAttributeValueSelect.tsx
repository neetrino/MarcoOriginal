"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, X } from "lucide-react";

import type { AdminAttributeValue } from "@/features/attributes/domain/attribute-admin-model";
import { AttributeValueSwatch } from "@/features/attributes/ui/AttributeValueSwatch";
import { useIsClient } from "@/lib/react/use-is-client";

type ProductDrawerAttributeValueSelectProps = {
  attributeTitle: string;
  modalTitle: string;
  closeLabel: string;
  value: string;
  allLabel: string;
  values: readonly AdminAttributeValue[];
  disabled?: boolean;
  triggerClassName?: string;
  onValueChange: (value: string) => void;
};

export function ProductDrawerAttributeValueSelect({
  attributeTitle,
  modalTitle,
  closeLabel,
  value,
  allLabel,
  values,
  disabled = false,
  triggerClassName = "",
  onValueChange,
}: ProductDrawerAttributeValueSelectProps) {
  const mounted = useIsClient();
  const [open, setOpen] = useState(false);
  const selected = values.find((entry) => entry.id === value) ?? null;

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function selectValue(next: string): void {
    onValueChange(next);
    setOpen(false);
  }

  const modal =
    open && mounted
      ? createPortal(
          <div
            className="fixed inset-0 z-[400] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label={modalTitle}
          >
            <button
              type="button"
              className="absolute inset-0 cursor-pointer bg-black/40"
              aria-label={closeLabel}
              onClick={() => setOpen(false)}
            />
            <div className="relative z-10 flex max-h-[min(90vh,720px)] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
              <header className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {modalTitle}
                </h2>
                <button
                  type="button"
                  aria-label={closeLabel}
                  onClick={() => setOpen(false)}
                  className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
                >
                  <X className="h-5 w-5" aria-hidden />
                </button>
              </header>

              <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
                  {values.map((entry) => {
                    const isSelected = value === entry.id;
                    return (
                      <button
                        key={entry.id}
                        type="button"
                        aria-pressed={isSelected}
                        aria-label={entry.title}
                        onClick={() => selectValue(entry.id)}
                        className={`flex flex-col items-center gap-2 rounded-xl border px-2 py-3 text-center transition-colors ${
                          isSelected
                            ? "border-marco-slate bg-slate-50"
                            : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <span
                          className={`flex h-4 w-4 items-center justify-center rounded border ${
                            isSelected
                              ? "border-gray-900 bg-gray-900 text-white"
                              : "border-gray-300 bg-white"
                          }`}
                          aria-hidden
                        >
                          {isSelected ? (
                            <svg
                              viewBox="0 0 12 12"
                              className="h-3 w-3"
                              fill="none"
                            >
                              <path
                                d="M2.5 6.2 4.8 8.5 9.5 3.5"
                                stroke="currentColor"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          ) : null}
                        </span>
                        <AttributeValueSwatch value={entry} size="lg" />
                        <span className="line-clamp-2 min-h-[2.5rem] text-xs leading-snug text-gray-800">
                          {entry.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <footer className="flex justify-end border-t border-gray-100 px-6 py-4">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-full border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-50"
                >
                  {closeLabel}
                </button>
              </footer>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <button
        type="button"
        disabled={disabled}
        className={`flex h-11 w-full items-center justify-between gap-2 rounded-lg border border-gray-200 bg-white px-3 text-left text-sm shadow-sm outline-none transition-colors hover:border-gray-300 disabled:cursor-not-allowed disabled:opacity-50 ${triggerClassName}`}
        aria-label={attributeTitle}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <span className="flex min-w-0 flex-1 items-center gap-2">
          {selected ? (
            <>
              <AttributeValueSwatch value={selected} size="sm" />
              <span className="min-w-0 truncate text-gray-900">
                {selected.title}
              </span>
            </>
          ) : (
            <span className="truncate text-slate-400">{allLabel}</span>
          )}
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 text-gray-400" aria-hidden />
      </button>
      {modal}
    </>
  );
}
