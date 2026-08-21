import { Banknote, Globe } from "lucide-react";

import { HEADER_MOBILE_ROUND_CONTROL_CLASS } from "@/components/layout/site-header-classes";
import type { Locale } from "@/lib/i18n/config";
import type { Currency } from "@/lib/money/currency";

export type LocaleCurrencySwitcherVariant = "toolbar" | "compact";

const localePillLabels: Record<Locale, string> = {
  hy: "ՀԱՅ",
  en: "ENG",
  ru: "РУС",
};

type LocaleSwitcherTriggerProps = {
  locale: Locale;
  currency: Currency;
  open: boolean;
  menuId: string;
  variant: LocaleCurrencySwitcherVariant;
  onToggle: () => void;
};

function LocalePillChevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`shrink-0 self-center transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      width="8"
      height="8"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M3 4.5L6 7.5L9 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CompactLocaleTrigger({
  ariaLabel,
  open,
  menuId,
  onToggle,
}: {
  ariaLabel: string;
  open: boolean;
  menuId: string;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      className={`${HEADER_MOBILE_ROUND_CONTROL_CLASS} gap-1 px-3 [&_svg]:text-white`}
      aria-expanded={open}
      aria-haspopup="dialog"
      aria-controls={menuId}
      aria-label={ariaLabel}
      onClick={onToggle}
    >
      <Globe className="h-5 w-5 shrink-0" strokeWidth={2.25} aria-hidden />
      <span className="text-xs font-bold leading-none" aria-hidden>
        /
      </span>
      <Banknote className="h-5 w-5 shrink-0" strokeWidth={2} aria-hidden />
    </button>
  );
}

function ToolbarLocaleTrigger({
  pillLabel,
  currency,
  ariaLabel,
  open,
  menuId,
  onToggle,
}: {
  pillLabel: string;
  currency: Currency;
  ariaLabel: string;
  open: boolean;
  menuId: string;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      className="flex h-10 min-w-[128px] shrink-0 items-center justify-center gap-1 overflow-hidden rounded-[80px] bg-marco-gray px-3 text-xs font-bold leading-none text-marco-slate"
      aria-expanded={open}
      aria-haspopup="dialog"
      aria-controls={menuId}
      aria-label={ariaLabel}
      onClick={onToggle}
    >
      <span className="flex shrink-0 items-center gap-2">
        <Globe className="h-4 w-4 shrink-0 self-center" strokeWidth={1.75} aria-hidden />
        <span className="inline-flex items-center whitespace-nowrap">
          {pillLabel} <span className="font-bold">/</span>
        </span>
      </span>
      <span className="flex min-w-0 flex-1 items-center justify-center gap-2">
        <Banknote className="h-4 w-4 shrink-0 self-center" strokeWidth={1.75} aria-hidden />
        <span className="inline-flex min-w-0 items-center whitespace-nowrap">{currency}</span>
      </span>
      <LocalePillChevron open={open} />
    </button>
  );
}

export function LocaleSwitcherTrigger({
  locale,
  currency,
  open,
  menuId,
  variant,
  onToggle,
}: LocaleSwitcherTriggerProps) {
  const pillLabel = localePillLabels[locale];
  const ariaLabel = `${pillLabel} / ${currency}`;

  if (variant === "compact") {
    return (
      <CompactLocaleTrigger
        ariaLabel={ariaLabel}
        open={open}
        menuId={menuId}
        onToggle={onToggle}
      />
    );
  }

  return (
    <ToolbarLocaleTrigger
      pillLabel={pillLabel}
      currency={currency}
      ariaLabel={ariaLabel}
      open={open}
      menuId={menuId}
      onToggle={onToggle}
    />
  );
}
