import "server-only";

import { eq } from "drizzle-orm";

import { getDb } from "@/db/client";
import { attributes } from "@/db/schema";
import { generateAttributeKey } from "@/features/attributes/domain/attribute-key";
import { createId } from "@/lib/id";

const MAX_KEY_ATTEMPTS = 50;

/** Returns a unique attribute key derived from the title. */
export async function allocateUniqueAttributeKey(
  title: string,
): Promise<string> {
  const root = generateAttributeKey(title).slice(0, 72);

  for (let attempt = 1; attempt <= MAX_KEY_ATTEMPTS; attempt += 1) {
    const candidate = attempt === 1 ? root : `${root}${attempt}`.slice(0, 80);
    const [existing] = await getDb()
      .select({ id: attributes.id })
      .from(attributes)
      .where(eq(attributes.key, candidate))
      .limit(1);

    if (!existing) return candidate;
  }

  return `${root}${createId().slice(0, 8)}`.slice(0, 80);
}
