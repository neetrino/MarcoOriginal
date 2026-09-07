import "server-only";

import { and, asc, desc, eq } from "drizzle-orm";

import { getProviders } from "@/config/providers";
import { getDb } from "@/db/client";
import { mediaAssets } from "@/db/schema";
import { MAX_HERO_MOBILE_IMAGES } from "@/features/hero/domain/hero-mobile-limits";
import type { HeroMediaRole } from "@/features/hero/domain/hero-media-role";
import { createId } from "@/lib/id";
import {
  extensionForImageMime,
  validateImageFile,
} from "@/lib/media/image-file";

export type { HeroMediaRole };

async function deleteHeroRoleMedia(
  heroSlideId: string,
  role: HeroMediaRole,
): Promise<void> {
  const db = getDb();
  const storage = getProviders().storage;
  const existing = await db
    .select({ objectKey: mediaAssets.objectKey })
    .from(mediaAssets)
    .where(
      and(
        eq(mediaAssets.heroSlideId, heroSlideId),
        eq(mediaAssets.role, role),
      ),
    );

  await db
    .delete(mediaAssets)
    .where(
      and(
        eq(mediaAssets.heroSlideId, heroSlideId),
        eq(mediaAssets.role, role),
      ),
    );
  await Promise.all(existing.map((row) => storage.deleteObject(row.objectKey)));
}

async function countHeroMobileImages(heroSlideId: string): Promise<number> {
  const rows = await getDb()
    .select({ id: mediaAssets.id })
    .from(mediaAssets)
    .where(
      and(
        eq(mediaAssets.heroSlideId, heroSlideId),
        eq(mediaAssets.role, "HERO_MOBILE"),
        eq(mediaAssets.uploadStatus, "READY"),
      ),
    );
  return rows.length;
}

async function nextHeroMobileSortOrder(heroSlideId: string): Promise<number> {
  const [last] = await getDb()
    .select({ sortOrder: mediaAssets.sortOrder })
    .from(mediaAssets)
    .where(
      and(
        eq(mediaAssets.heroSlideId, heroSlideId),
        eq(mediaAssets.role, "HERO_MOBILE"),
      ),
    )
    .orderBy(desc(mediaAssets.sortOrder))
    .limit(1);
  return (last?.sortOrder ?? -1) + 1;
}

/** Appends one mobile hero image without replacing existing carousel slides. */
export async function appendHeroMobileImage(
  heroSlideId: string,
  file: File,
): Promise<{ error: string | null }> {
  const validationError = validateImageFile(file);
  if (validationError) {
    return { error: validationError };
  }

  const count = await countHeroMobileImages(heroSlideId);
  if (count >= MAX_HERO_MOBILE_IMAGES) {
    return {
      error: `At most ${MAX_HERO_MOBILE_IMAGES} mobile hero images are allowed.`,
    };
  }

  const id = createId();
  const objectKey = `uploads/hero/${heroSlideId}/mobile/${id}.${extensionForImageMime(file.type)}`;
  await getProviders().storage.putObject({
    objectKey,
    body: Buffer.from(await file.arrayBuffer()),
    contentType: file.type,
  });

  await getDb().insert(mediaAssets).values({
    id,
    objectKey,
    mimeType: file.type,
    byteSize: file.size,
    uploadStatus: "READY",
    role: "HERO_MOBILE",
    sortOrder: await nextHeroMobileSortOrder(heroSlideId),
    isPrimary: false,
    heroSlideId,
  });

  return { error: null };
}

/**
 * Saves a desktop image (replace) or mobile image (replace-all).
 * Prefer {@link appendHeroMobileImage} for the home mobile carousel.
 */
export async function persistHeroImage(
  heroSlideId: string,
  file: File,
  role: HeroMediaRole,
): Promise<{ error: string | null }> {
  const validationError = validateImageFile(file);
  if (validationError) {
    return { error: validationError };
  }

  await deleteHeroRoleMedia(heroSlideId, role);

  const id = createId();
  const folder = role === "HERO_MOBILE" ? "mobile" : "desktop";
  const objectKey = `uploads/hero/${heroSlideId}/${folder}/${id}.${extensionForImageMime(file.type)}`;
  await getProviders().storage.putObject({
    objectKey,
    body: Buffer.from(await file.arrayBuffer()),
    contentType: file.type,
  });

  await getDb().insert(mediaAssets).values({
    id,
    objectKey,
    mimeType: file.type,
    byteSize: file.size,
    uploadStatus: "READY",
    role,
    sortOrder: 0,
    isPrimary: role === "HERO_DESKTOP",
    heroSlideId,
  });

  return { error: null };
}

/** Removes one hero media role for a slide and deletes the stored object(s). */
export async function removeHeroImage(
  heroSlideId: string,
  role: HeroMediaRole,
): Promise<void> {
  await deleteHeroRoleMedia(heroSlideId, role);
}

/** Removes one mobile carousel image by media asset id. */
export async function removeHeroMobileImageById(
  heroSlideId: string,
  mediaId: string,
): Promise<{ error: string | null }> {
  const db = getDb();
  const [row] = await db
    .select({
      id: mediaAssets.id,
      objectKey: mediaAssets.objectKey,
    })
    .from(mediaAssets)
    .where(
      and(
        eq(mediaAssets.id, mediaId),
        eq(mediaAssets.heroSlideId, heroSlideId),
        eq(mediaAssets.role, "HERO_MOBILE"),
      ),
    )
    .limit(1);

  if (!row) {
    return { error: "Mobile hero image not found." };
  }

  await db.delete(mediaAssets).where(eq(mediaAssets.id, row.id));
  await getProviders().storage.deleteObject(row.objectKey);
  return { error: null };
}

/** Reorders mobile carousel images; `orderedIds` must match current set. */
export async function reorderHeroMobileImages(
  heroSlideId: string,
  orderedIds: string[],
): Promise<{ error: string | null }> {
  if (orderedIds.length === 0) {
    return { error: null };
  }
  if (orderedIds.length > MAX_HERO_MOBILE_IMAGES) {
    return {
      error: `At most ${MAX_HERO_MOBILE_IMAGES} mobile hero images are allowed.`,
    };
  }
  if (new Set(orderedIds).size !== orderedIds.length) {
    return { error: "Duplicate mobile hero image ids." };
  }

  const db = getDb();
  const existing = await db
    .select({ id: mediaAssets.id })
    .from(mediaAssets)
    .where(
      and(
        eq(mediaAssets.heroSlideId, heroSlideId),
        eq(mediaAssets.role, "HERO_MOBILE"),
        eq(mediaAssets.uploadStatus, "READY"),
      ),
    )
    .orderBy(asc(mediaAssets.sortOrder));

  const existingIds = existing.map((row) => row.id);
  if (
    existingIds.length !== orderedIds.length ||
    !orderedIds.every((id) => existingIds.includes(id))
  ) {
    return { error: "Mobile hero image order does not match stored images." };
  }

  const now = new Date();
  await Promise.all(
    orderedIds.map((id, index) =>
      db
        .update(mediaAssets)
        .set({ sortOrder: index, updatedAt: now })
        .where(
          and(
            eq(mediaAssets.id, id),
            eq(mediaAssets.heroSlideId, heroSlideId),
            eq(mediaAssets.role, "HERO_MOBILE"),
          ),
        ),
    ),
  );

  return { error: null };
}

async function applyRoleFromForm(
  slideId: string,
  formData: FormData,
  role: HeroMediaRole,
  fileKey: string,
  removeKey: string,
): Promise<string | null> {
  if (formData.get(removeKey) === "1") {
    await removeHeroImage(slideId, role);
  }

  const image = formData.get(fileKey);
  if (!(image instanceof File) || image.size <= 0) {
    return null;
  }

  const result = await persistHeroImage(slideId, image, role);
  return result.error;
}

/** Applies desktop and mobile uploads/removals from the admin hero form. */
export async function applyHeroSlideMediaFromForm(
  slideId: string,
  formData: FormData,
): Promise<string | null> {
  const desktopError = await applyRoleFromForm(
    slideId,
    formData,
    "HERO_DESKTOP",
    "desktopImage",
    "removeDesktopImage",
  );
  if (desktopError) return desktopError;

  return applyRoleFromForm(
    slideId,
    formData,
    "HERO_MOBILE",
    "mobileImage",
    "removeMobileImage",
  );
}
