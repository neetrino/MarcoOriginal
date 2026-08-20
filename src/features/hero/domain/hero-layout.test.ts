import { describe, expect, it } from "vitest";

import { pickHeroLayout, HERO_SLOT_IDS } from "@/features/hero/domain/hero-layout";

describe("pickHeroLayout", () => {
  it("maps slides by stable slot ids", () => {
    const slides = [
      { id: HERO_SLOT_IDS.right },
      { id: HERO_SLOT_IDS.leftTop },
      { id: HERO_SLOT_IDS.leftBottom },
    ];

    expect(pickHeroLayout(slides)).toEqual({
      leftTop: slides[1],
      leftBottom: slides[2],
      right: slides[0],
    });
  });

  it("falls back to list order when ids are unknown", () => {
    const slides = [{ id: "a" }, { id: "b" }, { id: "c" }];

    expect(pickHeroLayout(slides)).toEqual({
      leftTop: slides[0],
      leftBottom: slides[1],
      right: slides[2],
    });
  });
});
