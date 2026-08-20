"use server";

import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { getDb } from "@/db/client";
import { auditLogs, reels, type ReelTranslationsJson } from "@/db/schema";
import { withTransaction } from "@/db/transaction";
import {
  persistReelVideo,
  removeReelVideo,
} from "@/features/reels/application/persist-reel-media";
import {
  reelIdSchema,
  upsertReelSchema,
  type ReelIdInput,
  type UpsertReelFormInput,
} from "@/features/reels/schemas/reel";
import { requireAdmin } from "@/lib/auth/policies";
import { invalidateReelsCache } from "@/lib/cache/invalidate-public";
import { createId } from "@/lib/id";
import { isLocale, locales, type Locale } from "@/lib/i18n/config";
import { err, ok, type Result } from "@/lib/result";

function revalidateReels(locale: string): void {
  revalidatePath(`/${locale}/admin/reels`);
  for (const loc of locales) {
    revalidatePath(`/${loc}`);
  }
  invalidateReelsCache();
}

function videoFromForm(mediaForm: FormData | undefined): File | null {
  const video = mediaForm?.get("video");
  if (video instanceof File && video.size > 0) {
    return video;
  }
  return null;
}

async function compensateFailedCreate(reelId: string): Promise<void> {
  await removeReelVideo(reelId);
  await getDb().delete(reels).where(eq(reels.id, reelId));
}

async function insertReelRecord(
  actorId: string,
  reelId: string,
  translations: ReelTranslationsJson,
  title: string,
): Promise<void> {
  await withTransaction(async (tx) => {
    await tx.insert(reels).values({
      id: reelId,
      translations,
      isActive: true,
      sortOrder: 0,
    });
    await tx.insert(auditLogs).values({
      id: createId(),
      actorUserId: actorId,
      action: "reel.create",
      targetType: "reel",
      targetId: reelId,
      afterDiff: { title },
      correlationId: createId(),
    });
  });
}

/** Creates an admin reel with a required video file. */
export async function createReelAction(
  locale: string,
  raw: UpsertReelFormInput,
  mediaForm?: FormData,
): Promise<Result<{ id: string }>> {
  if (!isLocale(locale)) {
    return err("INVALID_LOCALE", "Invalid locale.");
  }

  const parsed = upsertReelSchema.safeParse(raw);
  if (!parsed.success) {
    return err("VALIDATION_ERROR", "Invalid reel payload.");
  }

  const video = videoFromForm(mediaForm);
  if (!video) {
    return err("VIDEO_REQUIRED", "A video file is required.");
  }

  const actor = await requireAdmin(locale as Locale);
  const id = createId();
  const translations: ReelTranslationsJson = {
    [parsed.data.editingLocale]: { title: parsed.data.title },
  };

  try {
    await insertReelRecord(actor.id, id, translations, parsed.data.title);
    const mediaResult = await persistReelVideo(id, video);
    if (mediaResult.error) {
      await compensateFailedCreate(id);
      return err("VALIDATION_ERROR", mediaResult.error);
    }
    revalidateReels(locale);
    return ok({ id });
  } catch {
    await compensateFailedCreate(id);
    return err("REEL_CREATE_FAILED", "Unable to create reel.");
  }
}

async function deleteReelRecord(
  actorId: string,
  reelId: string,
): Promise<void> {
  await withTransaction(async (tx) => {
    const [existing] = await tx
      .select({ id: reels.id })
      .from(reels)
      .where(eq(reels.id, reelId))
      .for("update")
      .limit(1);

    if (!existing) {
      throw new Error("NOT_FOUND");
    }

    await tx.delete(reels).where(eq(reels.id, existing.id));
    await tx.insert(auditLogs).values({
      id: createId(),
      actorUserId: actorId,
      action: "reel.delete",
      targetType: "reel",
      targetId: existing.id,
      afterDiff: { deleted: true },
      correlationId: createId(),
    });
  });
}

/** Hard-deletes a reel and its stored video. */
export async function deleteReelAction(
  locale: string,
  raw: ReelIdInput,
): Promise<Result<{ id: string }>> {
  if (!isLocale(locale)) {
    return err("INVALID_LOCALE", "Invalid locale.");
  }

  const parsed = reelIdSchema.safeParse(raw);
  if (!parsed.success) {
    return err("VALIDATION_ERROR", "Invalid delete payload.");
  }

  const actor = await requireAdmin(locale as Locale);

  try {
    await removeReelVideo(parsed.data.reelId);
    await deleteReelRecord(actor.id, parsed.data.reelId);
    revalidateReels(locale);
    return ok({ id: parsed.data.reelId });
  } catch (error) {
    if (error instanceof Error && error.message === "NOT_FOUND") {
      return err("NOT_FOUND", "Reel not found.");
    }
    return err("REEL_DELETE_FAILED", "Unable to delete reel.");
  }
}

/** Increments a reel view counter from the storefront player. */
export async function incrementReelViewAction(
  raw: ReelIdInput,
): Promise<Result<{ id: string }>> {
  const parsed = reelIdSchema.safeParse(raw);
  if (!parsed.success) {
    return err("VALIDATION_ERROR", "Invalid reel.");
  }

  await getDb()
    .update(reels)
    .set({
      viewCount: sql`${reels.viewCount} + 1`,
      updatedAt: new Date(),
    })
    .where(eq(reels.id, parsed.data.reelId));

  return ok({ id: parsed.data.reelId });
}
