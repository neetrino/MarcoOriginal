import "server-only";

import { heroSlides } from "@/db/schema";
import { getDb } from "@/db/client";
import { ALL_HOME_BANNER_SLOTS } from "@/features/hero/domain/hero-layout";

/** Ensures homepage hero and floor banner slots exist for admin uploads. */
export async function ensureHeroLayoutSlides(): Promise<void> {
  const db = getDb();

  for (const slot of ALL_HOME_BANNER_SLOTS) {
    const copy = { title: slot.title };
    await db
      .insert(heroSlides)
      .values({
        id: slot.id,
        translations: { hy: copy, en: copy, ru: copy },
        sortOrder: slot.sortOrder,
        isActive: true,
      })
      .onConflictDoUpdate({
        target: heroSlides.id,
        set: {
          sortOrder: slot.sortOrder,
          isActive: true,
          updatedAt: new Date(),
        },
      });
  }
}
