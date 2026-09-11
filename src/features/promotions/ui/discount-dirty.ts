import { parseDiscountPercent } from "@/features/promotions/ui/discount-percent";

type BoardDiscountRow = {
  id: string;
  title: string;
  discountPercent: number | null;
  startsAt: string | null;
  endsAt: string | null;
};

type DirtyDiscountValues = {
  percentage: number | null;
  startsAt: string | null;
  endsAt: string | null;
};

/**
 * Returns changed discount rows, or the title of the first invalid percent field.
 */
export function collectChangedDiscountRows(
  rows: readonly BoardDiscountRow[],
  drafts: Record<string, string>,
  startsAtDrafts: Record<string, string>,
  endsAtDrafts: Record<string, string>,
):
  | { ok: true; changes: Array<BoardDiscountRow & DirtyDiscountValues> }
  | { ok: false; invalidTitle: string } {
  const changes: Array<BoardDiscountRow & DirtyDiscountValues> = [];

  for (const row of rows) {
    const percentage = parseDiscountPercent(drafts[row.id] ?? "");
    if (percentage === "invalid") {
      return { ok: false, invalidTitle: row.title };
    }

    const startsAtRaw = (startsAtDrafts[row.id] ?? "").trim();
    const endsAtRaw = (endsAtDrafts[row.id] ?? "").trim();
    const startsAt = startsAtRaw.length > 0 ? startsAtRaw : null;
    const endsAt = endsAtRaw.length > 0 ? endsAtRaw : null;
    if (
      percentage === row.discountPercent &&
      startsAt === (row.startsAt ?? null) &&
      endsAt === (row.endsAt ?? null)
    ) {
      continue;
    }

    changes.push({ ...row, percentage, startsAt, endsAt });
  }

  return { ok: true, changes };
}
