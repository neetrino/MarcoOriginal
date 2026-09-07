"use server";

import { desc, eq } from "drizzle-orm";

import { auditLogs, heroSlides } from "@/db/schema";
import { getDb } from "@/db/client";
import { withTransaction } from "@/db/transaction";
import type { HeroMediaRole } from "@/features/hero/domain/hero-media-role";
import {
  appendHeroMobileImage,
  persistHeroImage,
  removeHeroImage,
  removeHeroMobileImageById,
  reorderHeroMobileImages,
} from "@/features/hero/application/persist-hero-media";
import { revalidateHero } from "@/features/hero/application/revalidate-hero";
import { requireAdmin } from "@/lib/auth/policies";
import { createId } from "@/lib/id";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { err, ok, type Result } from "@/lib/result";

const DEFAULT_HERO_TITLE = "Hero banner";

function readImageFile(formData: FormData): File | null {
  const image = formData.get("image");
  if (image instanceof File && image.size > 0) {
    return image;
  }
  return null;
}

function readOrderedIds(formData: FormData): string[] | null {
  const raw = formData.get("orderedIds");
  if (typeof raw !== "string" || raw.trim().length === 0) {
    return null;
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    if (
      !Array.isArray(parsed) ||
      !parsed.every((item): item is string => typeof item === "string")
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

/** Creates a slide from a desktop or mobile upload on the hero banner page. */
export async function createHeroSlideFromImageAction(
  locale: string,
  role: HeroMediaRole,
  formData: FormData,
): Promise<Result<{ id: string }>> {
  if (!isLocale(locale)) {
    return err("INVALID_LOCALE", "Invalid locale.");
  }

  const image = readImageFile(formData);
  if (!image) {
    return err("VALIDATION_ERROR", "Image is required.");
  }

  const actor = await requireAdmin(locale as Locale);
  const id = createId();
  const copy = { title: DEFAULT_HERO_TITLE };

  try {
    await withTransaction(async (tx) => {
      const [last] = await tx
        .select({ sortOrder: heroSlides.sortOrder })
        .from(heroSlides)
        .orderBy(desc(heroSlides.sortOrder))
        .limit(1);

      await tx.insert(heroSlides).values({
        id,
        translations: { hy: copy, en: copy, ru: copy },
        sortOrder: (last?.sortOrder ?? -1) + 1,
        isActive: true,
      });

      await tx.insert(auditLogs).values({
        id: createId(),
        actorUserId: actor.id,
        action: "hero.create",
        targetType: "hero_slide",
        targetId: id,
        afterDiff: { title: DEFAULT_HERO_TITLE, role },
        correlationId: createId(),
      });
    });

    const mediaResult =
      role === "HERO_MOBILE"
        ? await appendHeroMobileImage(id, image)
        : await persistHeroImage(id, image, role);
    if (mediaResult.error) {
      return err("VALIDATION_ERROR", mediaResult.error);
    }

    revalidateHero(locale, id);
    return ok({ id });
  } catch {
    return err("HERO_CREATE_FAILED", "Unable to create hero banner.");
  }
}

/** Replaces or removes one desktop/mobile image on an existing slide. */
export async function saveHeroSlideImageAction(
  locale: string,
  slideId: string,
  role: HeroMediaRole,
  formData: FormData,
): Promise<Result<{ id: string }>> {
  if (!isLocale(locale)) {
    return err("INVALID_LOCALE", "Invalid locale.");
  }

  const actor = await requireAdmin(locale as Locale);

  try {
    const [existing] = await getDb()
      .select({ id: heroSlides.id })
      .from(heroSlides)
      .where(eq(heroSlides.id, slideId))
      .limit(1);

    if (!existing) {
      return err("NOT_FOUND", "Hero banner not found.");
    }

    if (formData.get("removeImage") === "1") {
      await removeHeroImage(slideId, role);
    } else {
      const image = readImageFile(formData);
      if (!image) {
        return err("VALIDATION_ERROR", "Image is required.");
      }
      const mediaResult = await persistHeroImage(slideId, image, role);
      if (mediaResult.error) {
        return err("VALIDATION_ERROR", mediaResult.error);
      }
    }

    await getDb().insert(auditLogs).values({
      id: createId(),
      actorUserId: actor.id,
      action: "hero.update",
      targetType: "hero_slide",
      targetId: slideId,
      afterDiff: { role, removed: formData.get("removeImage") === "1" },
      correlationId: createId(),
    });

    revalidateHero(locale, slideId);
    return ok({ id: slideId });
  } catch {
    return err("HERO_UPDATE_FAILED", "Unable to update hero banner image.");
  }
}

/** Appends one image to the mobile home-hero carousel. */
export async function addHeroMobileImageAction(
  locale: string,
  slideId: string,
  formData: FormData,
): Promise<Result<{ id: string }>> {
  if (!isLocale(locale)) {
    return err("INVALID_LOCALE", "Invalid locale.");
  }

  const actor = await requireAdmin(locale as Locale);
  const image = readImageFile(formData);
  if (!image) {
    return err("VALIDATION_ERROR", "Image is required.");
  }

  try {
    const [existing] = await getDb()
      .select({ id: heroSlides.id })
      .from(heroSlides)
      .where(eq(heroSlides.id, slideId))
      .limit(1);

    if (!existing) {
      return err("NOT_FOUND", "Hero banner not found.");
    }

    const mediaResult = await appendHeroMobileImage(slideId, image);
    if (mediaResult.error) {
      return err("VALIDATION_ERROR", mediaResult.error);
    }

    await getDb().insert(auditLogs).values({
      id: createId(),
      actorUserId: actor.id,
      action: "hero.update",
      targetType: "hero_slide",
      targetId: slideId,
      afterDiff: { role: "HERO_MOBILE", appended: true },
      correlationId: createId(),
    });

    revalidateHero(locale, slideId);
    return ok({ id: slideId });
  } catch {
    return err("HERO_UPDATE_FAILED", "Unable to add mobile hero image.");
  }
}

/** Removes one mobile carousel image by media id. */
export async function removeHeroMobileImageAction(
  locale: string,
  slideId: string,
  mediaId: string,
): Promise<Result<{ id: string }>> {
  if (!isLocale(locale)) {
    return err("INVALID_LOCALE", "Invalid locale.");
  }
  if (!mediaId.trim()) {
    return err("VALIDATION_ERROR", "Image id is required.");
  }

  const actor = await requireAdmin(locale as Locale);

  try {
    const [existing] = await getDb()
      .select({ id: heroSlides.id })
      .from(heroSlides)
      .where(eq(heroSlides.id, slideId))
      .limit(1);

    if (!existing) {
      return err("NOT_FOUND", "Hero banner not found.");
    }

    const mediaResult = await removeHeroMobileImageById(slideId, mediaId);
    if (mediaResult.error) {
      return err("NOT_FOUND", mediaResult.error);
    }

    await getDb().insert(auditLogs).values({
      id: createId(),
      actorUserId: actor.id,
      action: "hero.update",
      targetType: "hero_slide",
      targetId: slideId,
      afterDiff: { role: "HERO_MOBILE", removedMediaId: mediaId },
      correlationId: createId(),
    });

    revalidateHero(locale, slideId);
    return ok({ id: slideId });
  } catch {
    return err("HERO_UPDATE_FAILED", "Unable to remove mobile hero image.");
  }
}

/** Reorders mobile carousel images for one slide. */
export async function reorderHeroMobileImagesAction(
  locale: string,
  slideId: string,
  formData: FormData,
): Promise<Result<{ id: string }>> {
  if (!isLocale(locale)) {
    return err("INVALID_LOCALE", "Invalid locale.");
  }

  const orderedIds = readOrderedIds(formData);
  if (!orderedIds) {
    return err("VALIDATION_ERROR", "Image order is required.");
  }

  const actor = await requireAdmin(locale as Locale);

  try {
    const [existing] = await getDb()
      .select({ id: heroSlides.id })
      .from(heroSlides)
      .where(eq(heroSlides.id, slideId))
      .limit(1);

    if (!existing) {
      return err("NOT_FOUND", "Hero banner not found.");
    }

    const mediaResult = await reorderHeroMobileImages(slideId, orderedIds);
    if (mediaResult.error) {
      return err("VALIDATION_ERROR", mediaResult.error);
    }

    await getDb().insert(auditLogs).values({
      id: createId(),
      actorUserId: actor.id,
      action: "hero.update",
      targetType: "hero_slide",
      targetId: slideId,
      afterDiff: { role: "HERO_MOBILE", orderedIds },
      correlationId: createId(),
    });

    revalidateHero(locale, slideId);
    return ok({ id: slideId });
  } catch {
    return err("HERO_UPDATE_FAILED", "Unable to reorder mobile hero images.");
  }
}
