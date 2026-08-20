import "server-only";

import { and, eq, inArray } from "drizzle-orm";

import { getDb } from "@/db/client";
import { mediaAssets } from "@/db/schema";
import { mediaPublicUrl } from "@/lib/media/public-url";

/** Loads ready images keyed by attribute value id. */
export async function loadAttributeValueImageUrls(
  valueIds: readonly string[],
): Promise<Map<string, string>> {
  const images = new Map<string, string>();
  if (valueIds.length === 0) {
    return images;
  }

  const mediaRows = await getDb()
    .select({
      attributeValueId: mediaAssets.attributeValueId,
      objectKey: mediaAssets.objectKey,
    })
    .from(mediaAssets)
    .where(
      and(
        inArray(mediaAssets.attributeValueId, [...valueIds]),
        eq(mediaAssets.uploadStatus, "READY"),
      ),
    );

  for (const media of mediaRows) {
    if (!media.attributeValueId || images.has(media.attributeValueId)) continue;
    images.set(media.attributeValueId, mediaPublicUrl(media.objectKey));
  }

  return images;
}
