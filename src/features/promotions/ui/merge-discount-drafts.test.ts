import { describe, expect, it } from "vitest";

import { mergePreservingDirtyDrafts } from "@/features/promotions/ui/merge-discount-drafts";

describe("mergePreservingDirtyDrafts", () => {
  it("keeps unsaved drafts for other rows after one row is saved", () => {
    expect(
      mergePreservingDirtyDrafts(
        { a: "", b: "" },
        { a: "12", b: "" },
        { a: "12", b: "20" },
      ),
    ).toEqual({ a: "12", b: "20" });
  });

  it("accepts the server value for the row that was just saved", () => {
    expect(
      mergePreservingDirtyDrafts(
        { a: "5" },
        { a: "12" },
        { a: "12" },
      ),
    ).toEqual({ a: "12" });
  });

  it("drops drafts that match the previous board (not dirty)", () => {
    expect(
      mergePreservingDirtyDrafts(
        { a: "10", b: "" },
        { a: "10", b: "8" },
        { a: "10", b: "" },
      ),
    ).toEqual({ a: "10", b: "8" });
  });
});
