import "server-only";

import { eq, inArray } from "drizzle-orm";

import { getProviders } from "@/config/providers";
import { getDb } from "@/db/client";
import { mediaAssets } from "@/db/schema";
import { createId } from "@/lib/id";
import {
  extensionForImageMime,
  validateImageFile,
} from "@/lib/media/image-file";

/** Saves a primary swatch image for an attribute IMAGE value. */
export async function persistAttributeValueImage(
  valueId: string,
  file: File,
): Promise<{ error: string | null }> {
  const validationError = validateImageFile(file);
  if (validationError) {
    return { error: validationError };
  }

  const db = getDb();
  const storage = getProviders().storage;
  const existing = await db
    .select({ id: mediaAssets.id, objectKey: mediaAssets.objectKey })
    .from(mediaAssets)
    .where(eq(mediaAssets.attributeValueId, valueId));

  if (existing.length > 0) {
    await db
      .delete(mediaAssets)
      .where(eq(mediaAssets.attributeValueId, valueId));
    await Promise.all(
      existing.map((row) => storage.deleteObject(row.objectKey)),
    );
  }

  const id = createId();
  const objectKey = `uploads/attributes/${valueId}/${id}.${extensionForImageMime(file.type)}`;
  await storage.putObject({
    objectKey,
    body: Buffer.from(await file.arrayBuffer()),
    contentType: file.type,
  });

  await db.insert(mediaAssets).values({
    id,
    objectKey,
    mimeType: file.type,
    byteSize: file.size,
    uploadStatus: "READY",
    role: "PRIMARY",
    sortOrder: 0,
    isPrimary: true,
    attributeValueId: valueId,
  });

  return { error: null };
}

/** Removes stored objects and media rows for attribute IMAGE values. */
export async function removeAttributeValueImages(
  valueIds: readonly string[],
): Promise<void> {
  if (valueIds.length === 0) return;

  const db = getDb();
  const storage = getProviders().storage;
  const existing = await db
    .select({ objectKey: mediaAssets.objectKey })
    .from(mediaAssets)
    .where(inArray(mediaAssets.attributeValueId, [...valueIds]));

  await db
    .delete(mediaAssets)
    .where(inArray(mediaAssets.attributeValueId, [...valueIds]));
  await Promise.all(existing.map((row) => storage.deleteObject(row.objectKey)));
}
