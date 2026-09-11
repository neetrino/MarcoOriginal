import { parseDiscountPercent } from "@/features/promotions/ui/discount-percent";

type BoardDiscountRow = {
  id: string;
  title: string;
  discountPercent: number | null;
  endsAt: string | null;
};

type DirtyDiscountValues = {
  percentage: number | null;
  endsAt: string | null;
};

/**
 * Returns changed discount rows, or the title of the first invalid percent field.
 */
export function collectChangedDiscountRows(
  rows: readonly BoardDiscountRow[],
  drafts: Record<string, string>,
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

    const endsAtRaw = (endsAtDrafts[row.id] ?? "").trim();
    const endsAt = endsAtRaw.length > 0 ? endsAtRaw : null;
    if (
      percentage === row.discountPercent &&
      endsAt === (row.endsAt ?? null)
    ) {
      continue;
    }

    changes.push({ ...row, percentage, endsAt });
  }

  return { ok: true, changes };
}
