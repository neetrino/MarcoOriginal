import "server-only";

import { and, eq, inArray, or } from "drizzle-orm";

import { getDb } from "@/db/client";
import { mediaAssets } from "@/db/schema";
import { mediaPublicUrl } from "@/lib/media/public-url";

/** Loads primary brand images keyed by brand id. */
export async function loadBrandImageUrls(
  brandIds: readonly string[],
): Promise<Map<string, string>> {
  const images = new Map<string, string>();
  if (brandIds.length === 0) {
    return images;
  }

  const mediaRows = await getDb()
    .select({
      brandId: mediaAssets.brandId,
      objectKey: mediaAssets.objectKey,
    })
    .from(mediaAssets)
    .where(
      and(
        inArray(mediaAssets.brandId, [...brandIds]),
        eq(mediaAssets.uploadStatus, "READY"),
        or(eq(mediaAssets.isPrimary, true), eq(mediaAssets.role, "PRIMARY")),
      ),
    );

  for (const media of mediaRows) {
    if (!media.brandId || images.has(media.brandId)) continue;
    images.set(media.brandId, mediaPublicUrl(media.objectKey));
  }

  return images;
}
