import "server-only";

import { and, eq } from "drizzle-orm";

import { getProviders } from "@/config/providers";
import { getDb } from "@/db/client";
import { mediaAssets } from "@/db/schema";
import { createId } from "@/lib/id";
import {
  extensionForImageMime,
  validateImageFile,
} from "@/lib/media/image-file";
import type { HeroMediaRole } from "@/features/hero/domain/hero-media-role";

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

/** Saves a desktop or mobile hero image for a slide via object storage. */
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

/** Removes one hero media role for a slide and deletes the stored object. */
export async function removeHeroImage(
  heroSlideId: string,
  role: HeroMediaRole,
): Promise<void> {
  await deleteHeroRoleMedia(heroSlideId, role);
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
