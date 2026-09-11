/**
 * Discount board end-date helpers.
 * The admin picks a calendar day; the discount stays active through that local day.
 */

const DATE_INPUT_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Formats a Date for `<input type="date" />` (local calendar day). */
export function toDiscountEndsAtInput(
  value: Date | string | null | undefined,
): string {
  if (value == null || value === "") return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Parses a YYYY-MM-DD board field into an inclusive end-of-day Date,
 * or null when cleared.
 */
export function parseDiscountEndsAtInput(
  raw: string,
): Date | null | "invalid" {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const match = DATE_INPUT_PATTERN.exec(trimmed);
  if (!match) return "invalid";
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day, 23, 59, 59, 999);
  if (
    Number.isNaN(date.getTime()) ||
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return "invalid";
  }
  return date;
}

export function draftsFromEndsAt(
  items: ReadonlyArray<{ id: string; endsAt: string | null }>,
): Record<string, string> {
  return Object.fromEntries(
    items.map((item) => [item.id, item.endsAt ?? ""]),
  );
}

/** Whether an automatic discount is still within its optional window. */
export function isAutomaticDiscountCurrentlyActive(input: {
  startsAt?: Date | null;
  endsAt?: Date | null;
  now?: Date;
}): boolean {
  const now = input.now ?? new Date();
  if (input.startsAt && input.startsAt.getTime() > now.getTime()) {
    return false;
  }
  if (input.endsAt && input.endsAt.getTime() < now.getTime()) {
    return false;
  }
  return true;
}
