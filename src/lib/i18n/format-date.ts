/**
 * Locale-aware numeric date that is identical on Node and browsers.
 * Avoids `Intl.DateTimeFormat("hy")` ICU gaps that cause hydration mismatches.
 */
export function formatNumericDate(
  value: Date | string,
  locale: string,
): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  if (locale === "en") {
    return `${month}/${day}/${year}`;
  }

  // hy, ru, and unknown locales: DD.MM.YYYY
  return `${day}.${month}.${year}`;
}
