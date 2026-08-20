import { revalidatePath, updateTag } from "next/cache";

import { CACHE_TAGS } from "@/lib/cache/tags";

/** Invalidates admin hero routes and public home caches. */
export function revalidateHero(locale: string, slideId?: string): void {
  revalidatePath(`/${locale}/admin/hero`);
  if (slideId) {
    revalidatePath(`/${locale}/admin/hero/${slideId}`);
  }
  for (const loc of ["hy", "en", "ru"] as const) {
    revalidatePath(`/${loc}`);
  }
  updateTag(CACHE_TAGS.hero);
}
