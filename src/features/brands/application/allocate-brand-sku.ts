import "server-only";

import { and, eq, ne } from "drizzle-orm";

import { getDb } from "@/db/client";
import { brands } from "@/db/schema";
import { createId } from "@/lib/id";
import { generateBrandSku } from "@/features/brands/domain/brand-identity";

const MAX_SKU_ATTEMPTS = 50;

/** Returns a unique brand SKU derived from the title. */
export async function allocateUniqueBrandSku(
  title: string,
  excludeId?: string,
): Promise<string> {
  const root = generateBrandSku(title).slice(0, 100);

  for (let attempt = 1; attempt <= MAX_SKU_ATTEMPTS; attempt += 1) {
    const candidate =
      attempt === 1 ? root : `${root}-${attempt}`.slice(0, 120);
    const [existing] = await getDb()
      .select({ id: brands.id })
      .from(brands)
      .where(
        excludeId
          ? and(eq(brands.sku, candidate), ne(brands.id, excludeId))
          : eq(brands.sku, candidate),
      )
      .limit(1);

    if (!existing) return candidate;
  }

  return `${root}-${createId().slice(0, 8)}`.slice(0, 120);
}
