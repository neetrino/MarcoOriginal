import "server-only";

import { heroSlides } from "@/db/schema";
import { getDb } from "@/db/client";
import { HERO_LAYOUT_SLOTS } from "@/features/hero/domain/hero-layout";

/** Ensures the three homepage hero tiles exist so admin can upload into a fixed grid. */
export async function ensureHeroLayoutSlides(): Promise<void> {
  const db = getDb();

  for (const slot of HERO_LAYOUT_SLOTS) {
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
