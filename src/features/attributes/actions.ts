"use server";

import { and, eq, isNull, max } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getDb } from "@/db/client";
import { attributes, attributeValues } from "@/db/schema";
import { allocateUniqueAttributeKey } from "@/features/attributes/application/allocate-attribute-key";
import { listAttributeValueIds } from "@/features/attributes/application/list-attribute-value-ids";
import { removeAttributeValueImages } from "@/features/attributes/application/persist-attribute-value-media";
import { buildAttributeTranslations } from "@/features/attributes/domain/attribute-translations";
import { requireAdmin } from "@/lib/auth/policies";
import { createId } from "@/lib/id";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { err, ok, type Result } from "@/lib/result";

const attributeTitleSchema = z.object({
  title: z.string().trim().min(1).max(120),
});

function revalidateAttributes(locale: string): void {
  revalidatePath(`/${locale}/admin/attributes`);
}

async function readAttributeTitle(
  formData: FormData,
): Promise<Result<{ title: string }>> {
  const parsed = attributeTitleSchema.safeParse({
    title: formData.get("title"),
  });
  if (!parsed.success) {
    return err("VALIDATION_ERROR", "Invalid attribute payload.");
  }
  return ok(parsed.data);
}

/** Creates a catalog attribute from the admin drawer. */
export async function createAttributeFromDrawerAction(
  locale: string,
  formData: FormData,
): Promise<Result<{ id: string; title: string; key: string }>> {
  if (!isLocale(locale)) {
    return err("INVALID_LOCALE", "Invalid locale.");
  }

  const parsed = await readAttributeTitle(formData);
  if (!parsed.ok) return parsed;

  await requireAdmin(locale as Locale);

  const [maxSort] = await getDb()
    .select({ value: max(attributes.sortOrder) })
    .from(attributes)
    .where(isNull(attributes.deletedAt));

  const id = createId();
  const key = await allocateUniqueAttributeKey(parsed.value.title);
  await getDb().insert(attributes).values({
    id,
    key,
    translations: buildAttributeTranslations(parsed.value.title, key),
    sortOrder: (maxSort?.value ?? 0) + 1,
  });

  revalidateAttributes(locale);
  return ok({ id, title: parsed.value.title, key });
}

/** Updates an attribute name from the admin drawer. */
export async function updateAttributeFromDrawerAction(
  locale: string,
  attributeId: string,
  formData: FormData,
): Promise<Result<{ id: string }>> {
  if (!isLocale(locale)) {
    return err("INVALID_LOCALE", "Invalid locale.");
  }

  const parsed = await readAttributeTitle(formData);
  if (!parsed.ok) return parsed;

  await requireAdmin(locale as Locale);

  const [existing] = await getDb()
    .select({ id: attributes.id, key: attributes.key })
    .from(attributes)
    .where(and(eq(attributes.id, attributeId), isNull(attributes.deletedAt)))
    .limit(1);

  if (!existing) {
    return err("NOT_FOUND", "Attribute not found.");
  }

  await getDb()
    .update(attributes)
    .set({
      translations: buildAttributeTranslations(parsed.value.title, existing.key),
      updatedAt: new Date(),
    })
    .where(eq(attributes.id, existing.id));

  revalidateAttributes(locale);
  return ok({ id: existing.id });
}

/** Soft-deletes an attribute after removing its values and media. */
export async function deleteAttributeAction(
  locale: string,
  attributeId: string,
): Promise<Result<{ id: string }>> {
  if (!isLocale(locale)) {
    return err("INVALID_LOCALE", "Invalid locale.");
  }

  await requireAdmin(locale as Locale);

  const [existing] = await getDb()
    .select({ id: attributes.id })
    .from(attributes)
    .where(and(eq(attributes.id, attributeId), isNull(attributes.deletedAt)))
    .limit(1);

  if (!existing) {
    return err("NOT_FOUND", "Attribute not found.");
  }

  const valueIds = await listAttributeValueIds(existing.id);
  await removeAttributeValueImages(valueIds);
  await getDb()
    .delete(attributeValues)
    .where(eq(attributeValues.attributeId, existing.id));

  const [updated] = await getDb()
    .update(attributes)
    .set({
      deletedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(attributes.id, existing.id))
    .returning({ id: attributes.id });

  if (!updated) {
    return err("NOT_FOUND", "Attribute not found.");
  }

  revalidateAttributes(locale);
  return ok({ id: updated.id });
}
