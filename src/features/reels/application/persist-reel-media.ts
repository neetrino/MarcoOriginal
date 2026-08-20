import "server-only";

import { and, eq } from "drizzle-orm";

import { getProviders } from "@/config/providers";
import { getDb } from "@/db/client";
import { mediaAssets } from "@/db/schema";
import { createId } from "@/lib/id";
import {
  extensionForVideoMime,
  validateVideoFile,
} from "@/lib/media/video-file";

async function deleteReelVideoMedia(reelId: string): Promise<void> {
  const db = getDb();
  const storage = getProviders().storage;
  const existing = await db
    .select({ objectKey: mediaAssets.objectKey })
    .from(mediaAssets)
    .where(
      and(eq(mediaAssets.reelId, reelId), eq(mediaAssets.role, "REEL_VIDEO")),
    );

  await db
    .delete(mediaAssets)
    .where(
      and(eq(mediaAssets.reelId, reelId), eq(mediaAssets.role, "REEL_VIDEO")),
    );
  await Promise.all(existing.map((row) => storage.deleteObject(row.objectKey)));
}

/** Saves a reel video via object storage, replacing any previous video. */
export async function persistReelVideo(
  reelId: string,
  file: File,
): Promise<{ error: string | null }> {
  const validationError = validateVideoFile(file);
  if (validationError) {
    return { error: validationError };
  }

  await deleteReelVideoMedia(reelId);

  const id = createId();
  const objectKey = `uploads/reels/${reelId}/${id}.${extensionForVideoMime(file.type)}`;
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
    role: "REEL_VIDEO",
    sortOrder: 0,
    isPrimary: true,
    reelId,
  });

  return { error: null };
}

/** Removes reel video media and deletes the stored object. */
export async function removeReelVideo(reelId: string): Promise<void> {
  await deleteReelVideoMedia(reelId);
}
