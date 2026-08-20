import "server-only";

import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { unstable_cache } from "next/cache";

import { getDb } from "@/db/client";
import { mediaAssets, reels } from "@/db/schema";
import {
  reelDisplayTitle,
  resolveReelTranslation,
  shortReelId,
  type ReelTranslations,
} from "@/features/reels/domain/reel-rules";
import {
  CACHE_TAGS,
  PUBLIC_CACHE_REVALIDATE_SECONDS,
} from "@/lib/cache/tags";
import type { Locale } from "@/lib/i18n/config";
import { mediaPublicUrl } from "@/lib/media/public-url";

export type AdminReelListItem = {
  id: string;
  shortId: string;
  title: string;
  isActive: boolean;
  likeCount: number;
  viewCount: number;
  videoUrl: string | null;
  translations: ReelTranslations;
};

export type AdminReelsStats = {
  total: number;
  active: number;
  likes: number;
  views: number;
};

export type StorefrontReel = {
  id: string;
  title: string;
  videoUrl: string;
};

async function loadReelVideoUrls(
  reelIds: string[],
): Promise<Map<string, string>> {
  const videos = new Map<string, string>();
  if (reelIds.length === 0) {
    return videos;
  }

  const rows = await getDb()
    .select({
      reelId: mediaAssets.reelId,
      objectKey: mediaAssets.objectKey,
    })
    .from(mediaAssets)
    .where(
      and(
        inArray(mediaAssets.reelId, reelIds),
        eq(mediaAssets.uploadStatus, "READY"),
        eq(mediaAssets.role, "REEL_VIDEO"),
      ),
    );

  for (const row of rows) {
    if (!row.reelId || videos.has(row.reelId)) continue;
    videos.set(row.reelId, mediaPublicUrl(row.objectKey));
  }

  return videos;
}

/** Lists all reels for the admin CMS, newest first. */
export async function listAdminReels(
  locale: Locale,
): Promise<AdminReelListItem[]> {
  const rows = await getDb()
    .select()
    .from(reels)
    .orderBy(desc(reels.createdAt));
  const videos = await loadReelVideoUrls(rows.map((row) => row.id));

  return rows.map((row) => ({
    id: row.id,
    shortId: shortReelId(row.id),
    title: reelDisplayTitle(row.translations, locale),
    isActive: row.isActive,
    likeCount: row.likeCount,
    viewCount: row.viewCount,
    videoUrl: videos.get(row.id) ?? null,
    translations: row.translations,
  }));
}

/** Aggregates admin reel counters for the management header. */
export async function getAdminReelsStats(): Promise<AdminReelsStats> {
  const [row] = await getDb()
    .select({
      total: sql<number>`count(*)::int`,
      active: sql<number>`count(*) filter (where ${reels.isActive})::int`,
      likes: sql<number>`coalesce(sum(${reels.likeCount}), 0)::int`,
      views: sql<number>`coalesce(sum(${reels.viewCount}), 0)::int`,
    })
    .from(reels);

  return {
    total: row?.total ?? 0,
    active: row?.active ?? 0,
    likes: row?.likes ?? 0,
    views: row?.views ?? 0,
  };
}

async function loadActiveStorefrontReels(
  locale: Locale,
): Promise<StorefrontReel[]> {
  const rows = await getDb()
    .select()
    .from(reels)
    .where(eq(reels.isActive, true))
    .orderBy(desc(reels.createdAt));
  const videos = await loadReelVideoUrls(rows.map((row) => row.id));

  return rows.flatMap((row) => {
    const videoUrl = videos.get(row.id);
    if (!videoUrl) return [];
    return [
      {
        id: row.id,
        title: resolveReelTranslation(row.translations, locale).title,
        videoUrl,
      },
    ];
  });
}

/** Active reels with video for the homepage strip. */
export async function listActiveStorefrontReels(
  locale: Locale,
): Promise<StorefrontReel[]> {
  return unstable_cache(
    async () => loadActiveStorefrontReels(locale),
    ["active-storefront-reels", locale],
    {
      tags: [CACHE_TAGS.reels],
      revalidate: PUBLIC_CACHE_REVALIDATE_SECONDS,
    },
  )();
}
