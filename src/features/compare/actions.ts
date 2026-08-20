"use server";

import { z } from "zod";

import { removeCompare, toggleCompare } from "@/features/compare/queries";
import { err, ok, type Result } from "@/lib/result";

const productIdSchema = z.string().uuid();

export async function toggleCompareAction(
  productId: string,
): Promise<Result<{ inCompare: boolean; count: number }>> {
  const parsed = productIdSchema.safeParse(productId);
  if (!parsed.success) {
    return err("PRODUCT_UNAVAILABLE", "Product unavailable.");
  }

  try {
    const result = await toggleCompare(parsed.data);
    return ok(result);
  } catch (error) {
    const code = error instanceof Error ? error.message : "UNKNOWN";
    if (code === "PRODUCT_UNAVAILABLE") {
      return err("PRODUCT_UNAVAILABLE", "Product unavailable.");
    }
    if (code === "COMPARE_LIMIT") {
      return err("COMPARE_LIMIT", "Compare list is full.");
    }
    return err("COMPARE_FAILED", "Unable to update comparison.");
  }
}

export async function removeCompareAction(
  productId: string,
): Promise<Result<{ removed: true }>> {
  const parsed = productIdSchema.safeParse(productId);
  if (!parsed.success) {
    return err("PRODUCT_UNAVAILABLE", "Product unavailable.");
  }

  try {
    await removeCompare(parsed.data);
    return ok({ removed: true });
  } catch {
    return err("COMPARE_FAILED", "Unable to update comparison.");
  }
}
