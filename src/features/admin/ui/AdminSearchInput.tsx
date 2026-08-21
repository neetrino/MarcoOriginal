"use client";

import { Search } from "lucide-react";
import type { InputHTMLAttributes } from "react";

/** Shared admin search field with leading magnifying-glass icon. */
export const ADMIN_SEARCH_INPUT =
  "h-12 w-full rounded-full border border-gray-300 bg-white py-0 pr-5 pl-11 text-sm text-marco-ink outline-none transition-colors placeholder:text-marco-slate/50 hover:border-gray-400 focus:border-marco-ink focus:ring-2 focus:ring-marco-ink/15";

type AdminSearchInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  wrapperClassName?: string;
  inputClassName?: string;
};

export function AdminSearchInput({
  wrapperClassName = "",
  inputClassName = "",
  className,
  ...props
}: AdminSearchInputProps) {
  return (
    <div className={`relative ${wrapperClassName}`.trim()}>
      <Search
        className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-marco-slate/50"
        aria-hidden
      />
      <input
        type="search"
        {...props}
        className={`${ADMIN_SEARCH_INPUT} ${inputClassName} ${className ?? ""}`.trim()}
      />
    </div>
  );
}
