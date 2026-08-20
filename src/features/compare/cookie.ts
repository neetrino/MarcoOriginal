import "server-only";

import { cookies } from "next/headers";

import {
  COMPARE_COOKIE_MAX_AGE_SECONDS,
  COMPARE_COOKIE_NAME,
  parseCompareProductIds,
  serializeCompareProductIds,
} from "@/features/compare/domain/compare-list";

/** Reads compare product ids from the storefront cookie. */
export async function readCompareProductIds(): Promise<string[]> {
  const store = await cookies();
  return parseCompareProductIds(store.get(COMPARE_COOKIE_NAME)?.value);
}

/** Persists compare product ids, or deletes the cookie when empty. */
export async function writeCompareProductIds(ids: string[]): Promise<void> {
  const store = await cookies();
  if (ids.length === 0) {
    store.delete(COMPARE_COOKIE_NAME);
    return;
  }

  store.set(COMPARE_COOKIE_NAME, serializeCompareProductIds(ids), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COMPARE_COOKIE_MAX_AGE_SECONDS,
  });
}
