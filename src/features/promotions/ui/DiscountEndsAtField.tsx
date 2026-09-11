"use client";

import { useRef } from "react";
import { CalendarDays } from "lucide-react";

type DiscountEndsAtFieldProps = {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
};

/** Compact end-date control for discount board rows. */
export function DiscountEndsAtField({
  id,
  label,
  placeholder,
  value,
  disabled = false,
  onChange,
}: DiscountEndsAtFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function openPicker(): void {
    const input = inputRef.current;
    if (!input || disabled) return;

    try {
      if (typeof input.showPicker === "function") {
        input.showPicker();
        return;
      }
    } catch {
      // Fall through to native click when showPicker is blocked.
    }

    input.focus();
    input.click();
  }

  return (
    <div
      className={`relative inline-flex min-w-[9.5rem] items-center gap-1.5 rounded-lg border border-rose-200/80 bg-white px-2 py-1.5 text-sm transition-colors ${
        disabled
          ? "cursor-not-allowed opacity-50"
          : "cursor-pointer hover:border-rose-300 hover:bg-rose-50/80"
      }`}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        openPicker();
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          event.stopPropagation();
          openPicker();
        }
      }}
    >
      <CalendarDays className="h-4 w-4 shrink-0 text-rose-500" aria-hidden />
      <span
        className={`min-w-0 flex-1 truncate font-medium ${
          value ? "text-marco-ink" : "text-rose-500"
        }`}
      >
        {value || placeholder}
      </span>
      <input
        ref={inputRef}
        id={id}
        type="date"
        value={value}
        disabled={disabled}
        aria-label={label}
        onChange={(event) => onChange(event.target.value)}
        onClick={(event) => {
          event.stopPropagation();
          openPicker();
        }}
        className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-[0.01] disabled:cursor-not-allowed"
      />
    </div>
  );
}
