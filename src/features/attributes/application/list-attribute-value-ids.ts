import "server-only";

import { eq } from "drizzle-orm";

import { getDb } from "@/db/client";
import { attributeValues } from "@/db/schema";

/** Returns value ids for an attribute, used before delete/media cleanup. */
export async function listAttributeValueIds(
  attributeId: string,
): Promise<string[]> {
  const rows = await getDb()
    .select({ id: attributeValues.id })
    .from(attributeValues)
    .where(eq(attributeValues.attributeId, attributeId));

  return rows.map((row) => row.id);
}
