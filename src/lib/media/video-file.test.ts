import { describe, expect, it } from "vitest";

import {
  extensionForVideoMime,
  MEDIA_VIDEO_MAX_BYTES,
  validateVideoFile,
} from "@/lib/media/video-file";

function videoFile(type: string, size: number): File {
  return new File([new Uint8Array(size)], "clip.mp4", { type });
}

describe("validateVideoFile", () => {
  it("accepts an MP4 within the size limit", () => {
    expect(validateVideoFile(videoFile("video/mp4", 1024))).toBeNull();
  });

  it("rejects unsupported MIME types", () => {
    expect(validateVideoFile(videoFile("video/avi", 1024))).toBe(
      "Only MP4, WebM, or MOV videos are allowed.",
    );
  });

  it("rejects files over the size limit", () => {
    expect(
      validateVideoFile(videoFile("video/mp4", MEDIA_VIDEO_MAX_BYTES + 1)),
    ).toBe("Video must be 50MB or smaller.");
  });
});

describe("extensionForVideoMime", () => {
  it("maps known video MIME types", () => {
    expect(extensionForVideoMime("video/webm")).toBe("webm");
    expect(extensionForVideoMime("video/quicktime")).toBe("mov");
    expect(extensionForVideoMime("video/mp4")).toBe("mp4");
  });
});
