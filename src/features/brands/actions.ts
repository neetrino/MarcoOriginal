"use server";

import { and, eq, isNull, max } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getDb } from "@/db/client";
import { brands, type TranslationsJson } from "@/db/schema";
import { allocateUniqueBrandSku } from "@/features/brands/application/allocate-brand-sku";
import {
  persistBrandImage,
  removeBrandImage,
} from "@/features/brands/application/persist-brand-media";
import { requireAdmin } from "@/lib/auth/policies";
import { invalidateBrandsCache } from "@/lib/cache/invalidate-public";
import { createId } from "@/lib/id";
import { isLocale, locales, type Locale } from "@/lib/i18n/config";
import { err, ok, type Result } from "@/lib/result";

const brandTitleSchema = z.object({
  title: z.string().trim().min(1).max(120),
});

function buildTranslations(title: string, sku: string): TranslationsJson {
  const translation = { title, slug: sku.toLowerCase() };
  return { hy: translation, en: translation, ru: translation };
}

function revalidateBrands(locale: string): void {
  revalidatePath(`/${locale}/admin/brands`);
  for (const loc of locales) {
    revalidatePath(`/${loc}/brand`);
  }
  invalidateBrandsCache();
}

async function readBrandTitle(
  formData: FormData,
): Promise<Result<{ title: string }>> {
  const parsed = brandTitleSchema.safeParse({ title: formData.get("title") });
  if (!parsed.success) {
    return err("VALIDATION_ERROR", "Invalid brand payload.");
  }
  return ok(parsed.data);
}

/** Creates a brand from the admin drawer (title + optional image). */
export async function createBrandFromDrawerAction(
  locale: string,
  formData: FormData,
): Promise<Result<{ id: string }>> {
  if (!isLocale(locale)) {
    return err("INVALID_LOCALE", "Invalid locale.");
  }

  const parsed = await readBrandTitle(formData);
  if (!parsed.ok) return parsed;

  await requireAdmin(locale as Locale);

  const [maxSort] = await getDb()
    .select({ value: max(brands.sortOrder) })
    .from(brands)
    .where(isNull(brands.deletedAt));

  const id = createId();
  const sku = await allocateUniqueBrandSku(parsed.value.title);
  await getDb().insert(brands).values({
    id,
    sku,
    translations: buildTranslations(parsed.value.title, sku),
    sortOrder: (maxSort?.value ?? 0) + 1,
  });

  const image = formData.get("image");
  if (image instanceof File && image.size > 0) {
    const mediaResult = await persistBrandImage(id, image);
    if (mediaResult.error) {
      return err("VALIDATION_ERROR", mediaResult.error);
    }
  }

  revalidateBrands(locale);
  return ok({ id });
}

/** Updates a brand from the admin drawer (title + optional image). */
export async function updateBrandFromDrawerAction(
  locale: string,
  brandId: string,
  formData: FormData,
): Promise<Result<{ id: string }>> {
  if (!isLocale(locale)) {
    return err("INVALID_LOCALE", "Invalid locale.");
  }

  const parsed = await readBrandTitle(formData);
  if (!parsed.ok) return parsed;

  await requireAdmin(locale as Locale);

  const [existing] = await getDb()
    .select({ id: brands.id, sku: brands.sku })
    .from(brands)
    .where(and(eq(brands.id, brandId), isNull(brands.deletedAt)))
    .limit(1);

  if (!existing) {
    return err("NOT_FOUND", "Brand not found.");
  }

  await getDb()
    .update(brands)
    .set({
      translations: buildTranslations(parsed.value.title, existing.sku),
      updatedAt: new Date(),
    })
    .where(eq(brands.id, existing.id));

  const image = formData.get("image");
  const removeImage = formData.get("removeImage") === "1";

  if (image instanceof File && image.size > 0) {
    const mediaResult = await persistBrandImage(existing.id, image);
    if (mediaResult.error) {
      return err("VALIDATION_ERROR", mediaResult.error);
    }
  } else if (removeImage) {
    await removeBrandImage(existing.id);
  }

  revalidateBrands(locale);
  return ok({ id: existing.id });
}

/** Soft-deletes a brand. */
export async function deleteBrandAction(
  locale: string,
  brandId: string,
): Promise<Result<{ id: string }>> {
  if (!isLocale(locale)) {
    return err("INVALID_LOCALE", "Invalid locale.");
  }

  await requireAdmin(locale as Locale);

  const [updated] = await getDb()
    .update(brands)
    .set({
      deletedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(and(eq(brands.id, brandId), isNull(brands.deletedAt)))
    .returning({ id: brands.id });

  if (!updated) {
    return err("NOT_FOUND", "Brand not found.");
  }

  revalidateBrands(locale);
  return ok({ id: updated.id });
}
