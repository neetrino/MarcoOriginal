"use client";

import { locales, type Locale } from "@/lib/i18n/config";

type CategoryLocaleTabsProps = {
  value: Locale;
  disabled: boolean;
  ariaLabel: string;
  onChange: (locale: Locale) => void;
};

export function CategoryLocaleTabs({
  value,
  disabled,
  ariaLabel,
  onChange,
}: CategoryLocaleTabsProps) {
  return (
    <div role="tablist" aria-label={ariaLabel} className="flex gap-1">
      {locales.map((loc) => {
        const selected = loc === value;
        return (
          <button
            key={loc}
            type="button"
            role="tab"
            aria-selected={selected}
            disabled={disabled}
            onClick={() => onChange(loc)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold uppercase ${
              selected
                ? "bg-slate-700 text-white"
                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            }`}
          >
            {loc}
          </button>
        );
      })}
    </div>
  );
}
