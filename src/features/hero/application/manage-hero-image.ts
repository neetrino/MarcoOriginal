"use server";

import { desc, eq } from "drizzle-orm";

import { auditLogs, heroSlides } from "@/db/schema";
import { getDb } from "@/db/client";
import { withTransaction } from "@/db/transaction";
import type { HeroMediaRole } from "@/features/hero/domain/hero-media-role";
import {
  persistHeroImage,
  removeHeroImage,
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

    const mediaResult = await persistHeroImage(id, image, role);
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
