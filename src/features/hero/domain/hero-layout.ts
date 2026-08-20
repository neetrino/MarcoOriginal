export const HERO_SLOT_IDS = {
  leftTop: "01900000-0000-7000-8000-000000000050",
  leftBottom: "01900000-0000-7000-8000-000000000051",
  right: "01900000-0000-7000-8000-000000000052",
} as const;

export type HeroLayoutSlotKey = keyof typeof HERO_SLOT_IDS;

export const HERO_LAYOUT_SLOTS: ReadonlyArray<{
  key: HeroLayoutSlotKey;
  id: string;
  sortOrder: number;
  title: string;
}> = [
  {
    key: "leftTop",
    id: HERO_SLOT_IDS.leftTop,
    sortOrder: 0,
    title: "Left, top",
  },
  {
    key: "leftBottom",
    id: HERO_SLOT_IDS.leftBottom,
    sortOrder: 1,
    title: "Left, bottom",
  },
  {
    key: "right",
    id: HERO_SLOT_IDS.right,
    sortOrder: 2,
    title: "Right column",
  },
];

export type HeroLayoutPick<T extends { id: string }> = {
  leftTop: T | null;
  leftBottom: T | null;
  right: T | null;
};

/** Maps slides onto the three homepage hero tiles. */
export function pickHeroLayout<T extends { id: string }>(
  slides: T[],
): HeroLayoutPick<T> {
  const byId = new Map(slides.map((slide) => [slide.id, slide]));

  return {
    leftTop: byId.get(HERO_SLOT_IDS.leftTop) ?? slides[0] ?? null,
    leftBottom: byId.get(HERO_SLOT_IDS.leftBottom) ?? slides[1] ?? null,
    right: byId.get(HERO_SLOT_IDS.right) ?? slides[2] ?? null,
  };
}
