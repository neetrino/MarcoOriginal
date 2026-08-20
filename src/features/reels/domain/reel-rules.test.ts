import { describe, expect, it } from "vitest";

import {
  reelDisplayTitle,
  resolveReelTranslation,
  shortReelId,
} from "@/features/reels/domain/reel-rules";

describe("resolveReelTranslation", () => {
  it("prefers the active locale title", () => {
    expect(
      resolveReelTranslation(
        { hy: { title: "Հայերեն" }, en: { title: "English" } },
        "hy",
      ),
    ).toEqual({ title: "Հայերեն" });
  });

  it("falls back to English then other locales", () => {
    expect(
      resolveReelTranslation({ ru: { title: "Русский" } }, "hy"),
    ).toEqual({ title: "Русский" });
  });
});

describe("reelDisplayTitle", () => {
  it("returns Untitled when no title is set", () => {
    expect(reelDisplayTitle({}, "hy")).toBe("Untitled");
    expect(reelDisplayTitle({ en: { title: "  " } }, "en", "Առանց վերնագրի")).toBe(
      "Առանց վերնագրի",
    );
  });
});

describe("shortReelId", () => {
  it("uses the last six hex characters", () => {
    expect(shortReelId("01900000-0000-7000-8000-000000cpdmu0")).toBe(
      "reel-cpdmu0",
    );
  });
});
