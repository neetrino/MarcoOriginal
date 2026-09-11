"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { auditLogs, promotions } from "@/db/schema";
import { withTransaction, type DbTransaction } from "@/db/transaction";
import { upsertStoreSettingAction } from "@/features/settings/application/upsert-settings";
import { parseDiscountEndsAtInput } from "@/features/promotions/domain/discount-ends-at";
import { requireAdmin } from "@/lib/auth/policies";
import { invalidateProductsCache } from "@/lib/cache/invalidate-public";
import { createId } from "@/lib/id";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { err, ok, type Result } from "@/lib/result";

const nullablePercentSchema = z.number().int().min(1).max(100).nullable();

/** Catalog entity ids are text (UUID or imported source CUID). */
const catalogEntityIdSchema = z.string().trim().min(1).max(128);

/** Board date fields are YYYY-MM-DD, or null when cleared. */
const endsAtInputSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .nullable();

const DISCOUNT_TARGET_PRIORITIES = {
  product: 10,
  brand: 7,
  category: 5,
} as const;

type DiscountTarget = keyof typeof DISCOUNT_TARGET_PRIORITIES;

const targetDiscountSchema = z.object({
  target: z.enum(["product", "category", "brand"]),
  targetId: catalogEntityIdSchema,
  percentage: nullablePercentSchema,
  endsAt: endsAtInputSchema,
});

const categoryBatchSchema = z.object({
  items: z
    .array(
      z.object({
        categoryId: catalogEntityIdSchema,
        percentage: nullablePercentSchema,
        endsAt: endsAtInputSchema,
      }),
    )
    .max(500),
});

const brandBatchSchema = z.object({
  items: z
    .array(
      z.object({
        brandId: catalogEntityIdSchema,
        percentage: nullablePercentSchema,
        endsAt: endsAtInputSchema,
      }),
    )
    .max(500),
});

const globalDiscountSchema = z.object({
  percentage: nullablePercentSchema,
  endsAt: endsAtInputSchema,
});

type TargetDiscountInput = {
  target: DiscountTarget;
  targetId: string;
  percentage: number | null;
  endsAt: Date | null;
};

function revalidateDiscounts(locale: string): void {
  revalidatePath(`/${locale}/admin/discounts`);
  revalidatePath(`/${locale}`);
  revalidatePath(`/${locale}/products`);
  revalidatePath(`/${locale}/cart`);
  revalidatePath(`/${locale}/checkout`);
  invalidateProductsCache({ allProductDetails: true });
}

function targetWhere(target: DiscountTarget, targetId: string) {
  if (target === "product") return eq(promotions.productId, targetId);
  if (target === "brand") return eq(promotions.brandId, targetId);
  return eq(promotions.categoryId, targetId);
}

function resolveEndsAt(raw: string | null): Result<Date | null> {
  const parsed = parseDiscountEndsAtInput(raw ?? "");
  if (parsed === "invalid") {
    return err("VALIDATION_ERROR", "Invalid discount end date.");
  }
  return ok(parsed);
}

async function upsertTargetDiscountInTx(
  tx: DbTransaction,
  actorId: string,
  input: TargetDiscountInput,
): Promise<void> {
  const { target, targetId, percentage, endsAt } = input;
  const [existing] = await tx
    .select()
    .from(promotions)
    .where(
      and(
        eq(promotions.kind, "AUTOMATIC"),
        eq(promotions.discountType, "PERCENTAGE"),
        targetWhere(target, targetId),
      ),
    )
    .limit(1);

  const now = new Date();
  const correlationId = createId();

  if (percentage === null) {
    if (!existing) return;
    await tx.delete(promotions).where(eq(promotions.id, existing.id));
    await tx.insert(auditLogs).values({
      id: createId(),
      actorUserId: actorId,
      action: "promotion.delete",
      targetType: "promotion",
      targetId: existing.id,
      beforeDiff: {
        kind: existing.kind,
        discountValue: existing.discountValue,
      },
      correlationId,
    });
    return;
  }

  if (existing) {
    const samePercent = existing.discountValue === percentage;
    const sameEndsAt =
      (existing.endsAt?.getTime() ?? null) === (endsAt?.getTime() ?? null);
    if (samePercent && sameEndsAt && existing.isActive) {
      return;
    }

    await tx
      .update(promotions)
      .set({
        discountType: "PERCENTAGE",
        discountValue: percentage,
        endsAt,
        isActive: true,
        updatedAt: now,
      })
      .where(eq(promotions.id, existing.id));

    await tx.insert(auditLogs).values({
      id: createId(),
      actorUserId: actorId,
      action: "promotion.update",
      targetType: "promotion",
      targetId: existing.id,
      beforeDiff: {
        discountValue: existing.discountValue,
        endsAt: existing.endsAt,
      },
      afterDiff: { discountValue: percentage, endsAt },
      correlationId,
    });
    return;
  }

  const id = createId();
  await tx.insert(promotions).values({
    id,
    kind: "AUTOMATIC",
    code: null,
    productId: target === "product" ? targetId : null,
    categoryId: target === "category" ? targetId : null,
    brandId: target === "brand" ? targetId : null,
    discountType: "PERCENTAGE",
    discountValue: percentage,
    endsAt,
    isActive: true,
    priority: DISCOUNT_TARGET_PRIORITIES[target],
    allowStacking: false,
  });

  await tx.insert(auditLogs).values({
    id: createId(),
    actorUserId: actorId,
    action: "promotion.create",
    targetType: "promotion",
    targetId: id,
    afterDiff: {
      kind: "AUTOMATIC",
      discountType: "PERCENTAGE",
      discountValue: percentage,
      endsAt,
    },
    correlationId,
  });
}

/** Persists the store-wide percentage discount (null clears it). */
export async function setGlobalDiscountAction(
  locale: string,
  raw: z.infer<typeof globalDiscountSchema>,
): Promise<Result<{ percentage: number | null; endsAt: string | null }>> {
  if (!isLocale(locale)) {
    return err("INVALID_LOCALE", "Invalid locale.");
  }

  const parsed = globalDiscountSchema.safeParse(raw);
  if (!parsed.success) {
    return err("VALIDATION_ERROR", "Percentage must be 1–100 or empty.");
  }

  const endsAtResult = resolveEndsAt(parsed.data.endsAt);
  if (!endsAtResult.ok) {
    return endsAtResult;
  }

  const percentage = parsed.data.percentage;
  const endsAt =
    percentage == null ? null : (endsAtResult.value?.toISOString() ?? null);

  const result = await upsertStoreSettingAction(locale, {
    key: "store.globalDiscount",
    value: { percentage, endsAt },
  });

  if (!result.ok) {
    return result;
  }

  revalidateDiscounts(locale);
  revalidatePath(`/${locale}/admin/settings`);
  return ok({ percentage, endsAt });
}

/** Creates, updates, or clears one product/category/brand percentage discount. */
export async function upsertTargetDiscountAction(
  locale: string,
  raw: z.infer<typeof targetDiscountSchema>,
): Promise<Result<{ targetId: string }>> {
  if (!isLocale(locale)) {
    return err("INVALID_LOCALE", "Invalid locale.");
  }

  const parsed = targetDiscountSchema.safeParse(raw);
  if (!parsed.success) {
    return err("VALIDATION_ERROR", "Invalid discount payload.");
  }

  const endsAtResult = resolveEndsAt(parsed.data.endsAt);
  if (!endsAtResult.ok) {
    return endsAtResult;
  }

  const actor = await requireAdmin(locale as Locale);
  const { target, targetId, percentage } = parsed.data;
  const endsAt = percentage == null ? null : endsAtResult.value;

  try {
    await withTransaction(async (tx) => {
      await upsertTargetDiscountInTx(tx, actor.id, {
        target,
        targetId,
        percentage,
        endsAt,
      });
    });

    revalidateDiscounts(locale);
    return ok({ targetId });
  } catch {
    return err("DISCOUNT_UPSERT_FAILED", "Unable to save discount.");
  }
}

async function saveTargetDiscountBatch(
  locale: string,
  items: TargetDiscountInput[],
): Promise<Result<{ saved: number }>> {
  if (items.length === 0) {
    return ok({ saved: 0 });
  }

  const actor = await requireAdmin(locale as Locale);

  try {
    await withTransaction(async (tx) => {
      for (const item of items) {
        await upsertTargetDiscountInTx(tx, actor.id, item);
      }
    });

    revalidateDiscounts(locale);
    return ok({ saved: items.length });
  } catch {
    return err("DISCOUNT_UPSERT_FAILED", "Unable to save discount.");
  }
}

/** Batch-saves category percentage discounts from the discounts board. */
export async function saveCategoryDiscountsAction(
  locale: string,
  raw: z.infer<typeof categoryBatchSchema>,
): Promise<Result<{ saved: number }>> {
  if (!isLocale(locale)) {
    return err("INVALID_LOCALE", "Invalid locale.");
  }

  const parsed = categoryBatchSchema.safeParse(raw);
  if (!parsed.success) {
    return err("VALIDATION_ERROR", "Invalid category discounts payload.");
  }

  const items: TargetDiscountInput[] = [];
  for (const item of parsed.data.items) {
    const endsAtResult = resolveEndsAt(item.endsAt);
    if (!endsAtResult.ok) {
      return endsAtResult;
    }
    items.push({
      target: "category",
      targetId: item.categoryId,
      percentage: item.percentage,
      endsAt: item.percentage == null ? null : endsAtResult.value,
    });
  }

  return saveTargetDiscountBatch(locale, items);
}

/** Batch-saves brand percentage discounts from the discounts board. */
export async function saveBrandDiscountsAction(
  locale: string,
  raw: z.infer<typeof brandBatchSchema>,
): Promise<Result<{ saved: number }>> {
  if (!isLocale(locale)) {
    return err("INVALID_LOCALE", "Invalid locale.");
  }

  const parsed = brandBatchSchema.safeParse(raw);
  if (!parsed.success) {
    return err("VALIDATION_ERROR", "Invalid brand discounts payload.");
  }

  const items: TargetDiscountInput[] = [];
  for (const item of parsed.data.items) {
    const endsAtResult = resolveEndsAt(item.endsAt);
    if (!endsAtResult.ok) {
      return endsAtResult;
    }
    items.push({
      target: "brand",
      targetId: item.brandId,
      percentage: item.percentage,
      endsAt: item.percentage == null ? null : endsAtResult.value,
    });
  }

  return saveTargetDiscountBatch(locale, items);
}
