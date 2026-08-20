"use server";

import { and, eq, isNull, max } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getDb } from "@/db/client";
import { attributes, attributeValues } from "@/db/schema";
import {
  persistAttributeValueImage,
  removeAttributeValueImages,
} from "@/features/attributes/application/persist-attribute-value-media";
import { buildAttributeTranslations } from "@/features/attributes/domain/attribute-translations";
import { requireAdmin } from "@/lib/auth/policies";
import { createId } from "@/lib/id";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { err, ok, type Result } from "@/lib/result";

const COLOR_HEX_PATTERN = /^#[0-9A-Fa-f]{6}$/;
const valueTitleSchema = z.string().trim().min(1).max(120);
const colorHexSchema = z
  .string()
  .trim()
  .regex(COLOR_HEX_PATTERN)
  .transform((value) => value.toUpperCase());

function revalidateAttributes(locale: string): void {
  revalidatePath(`/${locale}/admin/attributes`);
}

async function requireExistingAttribute(
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

  return ok(existing);
}

async function nextValueSortOrder(attributeId: string): Promise<number> {
  const [maxSort] = await getDb()
    .select({ value: max(attributeValues.sortOrder) })
    .from(attributeValues)
    .where(eq(attributeValues.attributeId, attributeId));

  return (maxSort?.value ?? 0) + 1;
}

/** Adds a named value to an attribute. */
export async function addAttributeValueAction(
  locale: string,
  attributeId: string,
  title: string,
): Promise<Result<{ id: string }>> {
  const existing = await requireExistingAttribute(locale, attributeId);
  if (!existing.ok) return existing;

  const parsed = valueTitleSchema.safeParse(title);
  if (!parsed.success) {
    return err("VALIDATION_ERROR", "Enter a value name.");
  }

  const id = createId();
  await getDb().insert(attributeValues).values({
    id,
    attributeId: existing.value.id,
    kind: "TEXT",
    translations: buildAttributeTranslations(parsed.data),
    colorHex: null,
    sortOrder: await nextValueSortOrder(existing.value.id),
  });

  revalidateAttributes(locale);
  return ok({ id });
}

/** Sets or clears a color swatch on an existing value. */
export async function updateAttributeValueColorAction(
  locale: string,
  valueId: string,
  colorHex: string | null,
): Promise<Result<{ id: string }>> {
  const value = await requireExistingValue(locale, valueId);
  if (!value.ok) return value;

  let nextColor: string | null = null;
  if (colorHex) {
    const parsed = colorHexSchema.safeParse(colorHex);
    if (!parsed.success) {
      return err("VALIDATION_ERROR", "Choose a valid color.");
    }
    nextColor = parsed.data;
  }

  await getDb()
    .update(attributeValues)
    .set({
      kind: nextColor ? "COLOR" : "TEXT",
      colorHex: nextColor,
      updatedAt: new Date(),
    })
    .where(eq(attributeValues.id, value.value.id));

  revalidateAttributes(locale);
  return ok({ id: value.value.id });
}

/** Uploads an image swatch onto an existing value. */
export async function addAttributeValueImageAction(
  locale: string,
  valueId: string,
  formData: FormData,
): Promise<Result<{ id: string }>> {
  const value = await requireExistingValue(locale, valueId);
  if (!value.ok) return value;

  const image = formData.get("image");
  if (!(image instanceof File) || image.size === 0) {
    return err("VALIDATION_ERROR", "Choose an image to upload.");
  }

  const mediaResult = await persistAttributeValueImage(value.value.id, image);
  if (mediaResult.error) {
    return err("VALIDATION_ERROR", mediaResult.error);
  }

  await getDb()
    .update(attributeValues)
    .set({
      kind: value.value.colorHex ? "COLOR" : "IMAGE",
      updatedAt: new Date(),
    })
    .where(eq(attributeValues.id, value.value.id));

  revalidateAttributes(locale);
  return ok({ id: value.value.id });
}

/** Removes the image swatch from an existing value. */
export async function removeAttributeValueImageAction(
  locale: string,
  valueId: string,
): Promise<Result<{ id: string }>> {
  const value = await requireExistingValue(locale, valueId);
  if (!value.ok) return value;

  await removeAttributeValueImages([value.value.id]);
  await getDb()
    .update(attributeValues)
    .set({
      kind: value.value.colorHex ? "COLOR" : "TEXT",
      updatedAt: new Date(),
    })
    .where(eq(attributeValues.id, value.value.id));

  revalidateAttributes(locale);
  return ok({ id: value.value.id });
}

/** Deletes a named value and its media. */
export async function deleteAttributeValueAction(
  locale: string,
  valueId: string,
): Promise<Result<{ id: string }>> {
  const value = await requireExistingValue(locale, valueId);
  if (!value.ok) return value;

  await removeAttributeValueImages([value.value.id]);
  await getDb()
    .delete(attributeValues)
    .where(eq(attributeValues.id, value.value.id));

  revalidateAttributes(locale);
  return ok({ id: value.value.id });
}

async function requireExistingValue(
  locale: string,
  valueId: string,
): Promise<Result<{ id: string; colorHex: string | null }>> {
  if (!isLocale(locale)) {
    return err("INVALID_LOCALE", "Invalid locale.");
  }

  await requireAdmin(locale as Locale);

  const [value] = await getDb()
    .select({
      id: attributeValues.id,
      attributeId: attributeValues.attributeId,
      colorHex: attributeValues.colorHex,
    })
    .from(attributeValues)
    .where(eq(attributeValues.id, valueId))
    .limit(1);

  if (!value) {
    return err("NOT_FOUND", "Value not found.");
  }

  const [parent] = await getDb()
    .select({ id: attributes.id })
    .from(attributes)
    .where(
      and(eq(attributes.id, value.attributeId), isNull(attributes.deletedAt)),
    )
    .limit(1);

  if (!parent) {
    return err("NOT_FOUND", "Attribute not found.");
  }

  return ok({
    id: value.id,
    colorHex: value.colorHex,
  });
}
