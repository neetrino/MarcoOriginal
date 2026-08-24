export const HERO_SLOT_IDS = {
  leftTop: "01900000-0000-7000-8000-000000000050",
  leftBottom: "01900000-0000-7000-8000-000000000051",
  right: "01900000-0000-7000-8000-000000000052",
} as const;

export const HOME_FLOOR_SLOT_IDS = {
  appDownload: "01900000-0000-7000-8000-000000000053",
  promoLeft: "01900000-0000-7000-8000-000000000054",
  promoRight: "01900000-0000-7000-8000-000000000055",
} as const;

export type HeroLayoutSlotKey = keyof typeof HERO_SLOT_IDS;
export type HomeFloorSlotKey = keyof typeof HOME_FLOOR_SLOT_IDS;
export type HomeBannerSlotKey = HeroLayoutSlotKey | HomeFloorSlotKey;

export type HomeBannerSlot = {
  key: HomeBannerSlotKey;
  id: string;
  sortOrder: number;
  title: string;
};

export const HERO_LAYOUT_SLOTS: ReadonlyArray<
  HomeBannerSlot & { key: HeroLayoutSlotKey }
> = [
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

export const HOME_FLOOR_BANNER_SLOTS: ReadonlyArray<
  HomeBannerSlot & { key: HomeFloorSlotKey }
> = [
  {
    key: "appDownload",
    id: HOME_FLOOR_SLOT_IDS.appDownload,
    sortOrder: 10,
    title: "App download banner",
  },
  {
    key: "promoLeft",
    id: HOME_FLOOR_SLOT_IDS.promoLeft,
    sortOrder: 11,
    title: "Promo banner, left",
  },
  {
    key: "promoRight",
    id: HOME_FLOOR_SLOT_IDS.promoRight,
    sortOrder: 12,
    title: "Promo banner, right",
  },
];

export const ALL_HOME_BANNER_SLOTS: ReadonlyArray<HomeBannerSlot> = [
  ...HERO_LAYOUT_SLOTS,
  ...HOME_FLOOR_BANNER_SLOTS,
];

const HOME_FLOOR_SLOT_ID_SET = new Set<string>(
  Object.values(HOME_FLOOR_SLOT_IDS),
);

export type HeroLayoutPick<T extends { id: string }> = {
  leftTop: T | null;
  leftBottom: T | null;
  right: T | null;
};

export type HomeFloorBannerPick<T extends { id: string }> = {
  appDownload: T | null;
  promoLeft: T | null;
  promoRight: T | null;
};

export function isHomeFloorSlotId(id: string): boolean {
  return HOME_FLOOR_SLOT_ID_SET.has(id);
}

/** Maps slides onto the three homepage hero tiles. */
export function pickHeroLayout<T extends { id: string }>(
  slides: T[],
): HeroLayoutPick<T> {
  const byId = new Map(slides.map((slide) => [slide.id, slide]));
  const candidates = slides.filter((slide) => !isHomeFloorSlotId(slide.id));

  return {
    leftTop: byId.get(HERO_SLOT_IDS.leftTop) ?? candidates[0] ?? null,
    leftBottom: byId.get(HERO_SLOT_IDS.leftBottom) ?? candidates[1] ?? null,
    right: byId.get(HERO_SLOT_IDS.right) ?? candidates[2] ?? null,
  };
}

/** Maps reserved homepage floor banners. No list-order fallback. */
export function pickHomeFloorBanners<T extends { id: string }>(
  slides: T[],
): HomeFloorBannerPick<T> {
  const byId = new Map(slides.map((slide) => [slide.id, slide]));

  return {
    appDownload: byId.get(HOME_FLOOR_SLOT_IDS.appDownload) ?? null,
    promoLeft: byId.get(HOME_FLOOR_SLOT_IDS.promoLeft) ?? null,
    promoRight: byId.get(HOME_FLOOR_SLOT_IDS.promoRight) ?? null,
  };
}
