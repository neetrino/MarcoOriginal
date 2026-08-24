import { describe, expect, it } from "vitest";

import {
  pickHeroLayout,
  pickHomeFloorBanners,
  HERO_SLOT_IDS,
  HOME_FLOOR_SLOT_IDS,
} from "@/features/hero/domain/hero-layout";

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

  it("does not use floor banner slides as hero fallbacks", () => {
    const slides = [
      { id: HOME_FLOOR_SLOT_IDS.appDownload },
      { id: HOME_FLOOR_SLOT_IDS.promoLeft },
      { id: HOME_FLOOR_SLOT_IDS.promoRight },
      { id: "legacy-hero" },
    ];

    expect(pickHeroLayout(slides)).toEqual({
      leftTop: slides[3],
      leftBottom: null,
      right: null,
    });
  });
});

describe("pickHomeFloorBanners", () => {
  it("maps reserved floor slot ids and ignores other slides", () => {
    const slides = [
      { id: HERO_SLOT_IDS.leftTop },
      { id: HOME_FLOOR_SLOT_IDS.promoRight },
      { id: HOME_FLOOR_SLOT_IDS.appDownload },
    ];

    expect(pickHomeFloorBanners(slides)).toEqual({
      appDownload: slides[2],
      promoLeft: null,
      promoRight: slides[1],
    });
  });
});
