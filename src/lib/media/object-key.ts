const REF_MARKER = "::ref:";

/** Strips import-only uniqueness suffixes from a stored media object key. */
export function canonicalizeMediaObjectKey(objectKey: string): string {
  const idx = objectKey.indexOf(REF_MARKER);
  const base = idx >= 0 ? objectKey.slice(0, idx) : objectKey;
  return base.replace(/^\//, "");
}

/** True when the stored key is already an absolute URL or data URI. */
export function isAbsoluteMediaRef(objectKey: string): boolean {
  const key = canonicalizeMediaObjectKey(objectKey);
  return (
    key.startsWith("data:") ||
    key.startsWith("https://") ||
    key.startsWith("http://")
  );
}

/**
 * Ensures unique `object_key` rows while preserving the canonical source URL/key.
 * Duplicate sources become `${base}::ref:${assetId}`.
 */
export function uniqueMediaObjectKey(
  baseKey: string,
  assetId: string,
  usedKeys: Set<string>,
): string {
  if (!usedKeys.has(baseKey)) {
    usedKeys.add(baseKey);
    return baseKey;
  }
  const aliased = `${baseKey}${REF_MARKER}${assetId}`;
  usedKeys.add(aliased);
  return aliased;
}

/** Storage key for R2 delete/put when the DB value may be an absolute URL. */
export function storageKeyFromMediaObjectKey(objectKey: string): string | null {
  const key = canonicalizeMediaObjectKey(objectKey);
  if (key.startsWith("data:")) return null;
  if (key.startsWith("http://") || key.startsWith("https://")) {
    try {
      return new URL(key).pathname.replace(/^\//, "") || null;
    } catch {
      return null;
    }
  }
  return key;
}
