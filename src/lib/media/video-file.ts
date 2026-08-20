const ALLOWED_VIDEO_MIME = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
]);

export const MEDIA_VIDEO_MAX_BYTES = 50 * 1024 * 1024;

export function extensionForVideoMime(mimeType: string): string {
  if (mimeType === "video/webm") return "webm";
  if (mimeType === "video/quicktime") return "mov";
  return "mp4";
}

/** Validates MIME and size for admin reel video uploads. */
export function validateVideoFile(
  file: File,
  maxBytes = MEDIA_VIDEO_MAX_BYTES,
): string | null {
  if (!ALLOWED_VIDEO_MIME.has(file.type)) {
    return "Only MP4, WebM, or MOV videos are allowed.";
  }
  if (file.size > maxBytes) {
    return `Video must be ${Math.floor(maxBytes / (1024 * 1024))}MB or smaller.`;
  }
  return null;
}
