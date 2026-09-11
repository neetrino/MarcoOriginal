/**
 * Discount board schedule helpers (start/end datetime-local strings).
 * Format: YYYY-MM-DDTHH:mm (local wall time).
 */

const DATE_TIME_PATTERN =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/;
const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

export type DiscountScheduleDraft = {
  startsAt: string;
  endsAt: string;
};

/** Formats a Date as local datetime-local value. */
export function toDiscountDateTimeInput(
  value: Date | string | null | undefined,
): string {
  if (value == null || value === "") return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hour}:${minute}`;
}

/** @deprecated Prefer toDiscountDateTimeInput — kept for date-only legacy drafts. */
export function toDiscountEndsAtInput(
  value: Date | string | null | undefined,
): string {
  return toDiscountDateTimeInput(value);
}

/**
 * Parses YYYY-MM-DDTHH:mm (or legacy YYYY-MM-DD as end-of-day) into a Date.
 */
export function parseDiscountDateTimeInput(
  raw: string,
): Date | null | "invalid" {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const dateTime = DATE_TIME_PATTERN.exec(trimmed);
  if (dateTime) {
    const year = Number(dateTime[1]);
    const month = Number(dateTime[2]);
    const day = Number(dateTime[3]);
    const hour = Number(dateTime[4]);
    const minute = Number(dateTime[5]);
    if (hour > 23 || minute > 59) return "invalid";
    const date = new Date(year, month - 1, day, hour, minute, 0, 0);
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

  const dateOnly = DATE_ONLY_PATTERN.exec(trimmed);
  if (dateOnly) {
    const year = Number(dateOnly[1]);
    const month = Number(dateOnly[2]);
    const day = Number(dateOnly[3]);
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

  return "invalid";
}

/** @deprecated Prefer parseDiscountDateTimeInput. */
export function parseDiscountEndsAtInput(
  raw: string,
): Date | null | "invalid" {
  return parseDiscountDateTimeInput(raw);
}

export function draftsFromScheduleField(
  items: ReadonlyArray<{ id: string; value: string | null }>,
): Record<string, string> {
  return Object.fromEntries(
    items.map((item) => [item.id, item.value ?? ""]),
  );
}

export function draftsFromEndsAt(
  items: ReadonlyArray<{ id: string; endsAt: string | null }>,
): Record<string, string> {
  return draftsFromScheduleField(
    items.map((item) => ({ id: item.id, value: item.endsAt })),
  );
}

export function draftsFromStartsAt(
  items: ReadonlyArray<{ id: string; startsAt: string | null }>,
): Record<string, string> {
  return draftsFromScheduleField(
    items.map((item) => ({ id: item.id, value: item.startsAt })),
  );
}

/** Local calendar day key YYYY-MM-DD. */
export function toLocalDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function isLocalDateBeforeToday(date: Date, today = new Date()): boolean {
  return startOfLocalDay(date).getTime() < startOfLocalDay(today).getTime();
}

/** Compact chip label for a start/end schedule. */
export function formatDiscountScheduleLabel(
  startsAt: string,
  endsAt: string,
  locale: string,
): string {
  const start = parseDiscountDateTimeInput(startsAt);
  const end = parseDiscountDateTimeInput(endsAt);
  if ((start == null || start === "invalid") && (end == null || end === "invalid")) {
    return "";
  }

  const formatter = new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  if (start instanceof Date && end instanceof Date) {
    return `${formatter.format(start)} – ${formatter.format(end)}`;
  }
  if (start instanceof Date) {
    return formatter.format(start);
  }
  if (end instanceof Date) {
    return formatter.format(end);
  }
  return "";
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
