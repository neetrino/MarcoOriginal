import { currencySymbols, type Currency } from "@/lib/money/currency";
import { getCurrencyMeta } from "@/lib/money/currency-meta";

/** Narrow no-break space — stable across Node and browsers (unlike Intl hy/AMD). */
const GROUP_SEPARATOR = "\u202f";

/**
 * Formats the major-unit number without Intl currency style.
 * Avoids SSR/client hydration mismatches from ICU differences (e.g. hy + AMD).
 */
function formatMajorAmount(major: number, fractionDigits: number): string {
  const sign = major < 0 ? "-" : "";
  const absolute = Math.abs(major);
  const [integerPart = "0", fractionPart] = absolute
    .toFixed(fractionDigits)
    .split(".");
  const grouped = integerPart.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    GROUP_SEPARATOR,
  );

  if (fractionDigits > 0 && fractionPart !== undefined) {
    return `${sign}${grouped}.${fractionPart}`;
  }

  return `${sign}${grouped}`;
}

function formatMoneyParts(
  amount: bigint | number,
  currency: Currency,
): { major: string; code: Currency; symbol: string } {
  const meta = getCurrencyMeta(currency);
  const raw = typeof amount === "bigint" ? Number(amount) : amount;

  if (!Number.isFinite(raw)) {
    throw new Error("Money amount is not finite");
  }

  const major = raw / 10 ** meta.scale;
  return {
    major: formatMajorAmount(major, meta.fractionDigits),
    code: currency,
    symbol: currencySymbols[currency],
  };
}

/** Formats an integer minor-unit amount with a stable currency code suffix. */
export function formatMoneyAmount(
  amount: bigint | number,
  currency: Currency,
  locale: string,
): string {
  void locale;
  const parts = formatMoneyParts(amount, currency);
  return `${parts.major} ${parts.code}`;
}

/** Formats an integer minor-unit amount with the currency glyph (`12 500 ֏`). */
export function formatMoneyWithSymbol(
  amount: bigint | number,
  currency: Currency,
  locale: string,
): string {
  void locale;
  const parts = formatMoneyParts(amount, currency);
  return `${parts.major}\u00a0${parts.symbol}`;
}
