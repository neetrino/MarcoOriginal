import type { AdminHeroSlideListItem } from "@/features/hero/application/queries";
import type {
  HomeFloorBannerPick,
  HomeFloorSlotKey,
} from "@/features/hero/domain/hero-layout";
import {
  HOME_APP_BANNER_DEFAULT_PATH,
  HOME_PROMO_LEFT_DEFAULT_PATH,
  HOME_PROMO_RIGHT_DEFAULT_PATH,
} from "@/features/hero/domain/home-floor-defaults";
import {
  APP_DOWNLOAD_PREVIEW_CLASS,
  APP_DOWNLOAD_RADIUS_CLASS,
  MOBILE_FLOOR_PREVIEW_CLASS,
  PROMO_LEFT_PREVIEW_CLASS,
  PROMO_STRIP_GRID_CLASS,
  PROMO_TILE_RADIUS_CLASS,
} from "@/features/hero/ui/hero-banner-classes";
import { HeroBannerImageField } from "@/features/hero/ui/HeroBannerImageField";

type FloorCopy = {
  sectionAppDownload: string;
  sectionAppDownloadHint: string;
  appDownloadBanner: string;
  sectionPromoStrip: string;
  promoCardLeft: string;
  promoCardRight: string;
  sectionMobileFloor: string;
  sectionMobileFloorHint: string;
  mobileFloorBanner: string;
};

type AdminHeroFloorSectionsProps = {
  copy: FloorCopy;
  floor: HomeFloorBannerPick<AdminHeroSlideListItem>;
  isBusy: boolean;
  uploadingSlot: HomeFloorSlotKey | "floorMobile" | null;
  onUpload: (
    slide: AdminHeroSlideListItem | null,
    slot: HomeFloorSlotKey | "floorMobile",
    file: File,
  ) => void;
};

export function AdminHeroDesktopFloorSections({
  copy,
  floor,
  isBusy,
  uploadingSlot,
  onUpload,
}: AdminHeroFloorSectionsProps) {
  return (
    <div className="space-y-5">
      <section className="space-y-1">
        <h2 className="text-base font-semibold text-gray-900">
          {copy.sectionAppDownload}
        </h2>
        <p className="text-sm text-gray-500">{copy.sectionAppDownloadHint}</p>
      </section>
      <HeroBannerImageField
        label={copy.appDownloadBanner}
        currentUrl={
          floor.appDownload?.desktopImageUrl ?? HOME_APP_BANNER_DEFAULT_PATH
        }
        uploading={uploadingSlot === "appDownload"}
        disabled={isBusy || !floor.appDownload}
        previewClassName={APP_DOWNLOAD_PREVIEW_CLASS}
        previewRadiusClassName={APP_DOWNLOAD_RADIUS_CLASS}
        onUpload={(file) => onUpload(floor.appDownload, "appDownload", file)}
      />
      <div className="border-t border-gray-100 pt-4">
        <h2 className="mb-4 text-base font-semibold text-gray-900">
          {copy.sectionPromoStrip}
        </h2>
        <div className={PROMO_STRIP_GRID_CLASS}>
          <div className="min-w-0">
            <HeroBannerImageField
              label={copy.promoCardLeft}
              currentUrl={
                floor.promoLeft?.desktopImageUrl ?? HOME_PROMO_LEFT_DEFAULT_PATH
              }
              uploading={uploadingSlot === "promoLeft"}
              disabled={isBusy || !floor.promoLeft}
              previewClassName={PROMO_LEFT_PREVIEW_CLASS}
              previewRadiusClassName={PROMO_TILE_RADIUS_CLASS}
              onUpload={(file) => onUpload(floor.promoLeft, "promoLeft", file)}
            />
          </div>
          <div className="relative min-h-0 min-w-0 max-md:aspect-[820/328] md:h-full">
            <HeroBannerImageField
              label={copy.promoCardRight}
              currentUrl={
                floor.promoRight?.desktopImageUrl ?? HOME_PROMO_RIGHT_DEFAULT_PATH
              }
              uploading={uploadingSlot === "promoRight"}
              disabled={isBusy || !floor.promoRight}
              previewClassName="h-full w-full"
              previewRadiusClassName={PROMO_TILE_RADIUS_CLASS}
              fillCell
              onUpload={(file) => onUpload(floor.promoRight, "promoRight", file)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminHeroMobileFloorSection({
  copy,
  floor,
  isBusy,
  uploadingSlot,
  onUpload,
}: AdminHeroFloorSectionsProps) {
  return (
    <div className="space-y-1">
      <div className="mb-4 space-y-1">
        <h2 className="text-base font-semibold text-gray-900">
          {copy.sectionMobileFloor}
        </h2>
        <p className="text-sm text-gray-500">{copy.sectionMobileFloorHint}</p>
      </div>
      <HeroBannerImageField
        label={copy.mobileFloorBanner}
        currentUrl={
          floor.promoLeft?.mobileImageUrl ??
          floor.promoLeft?.desktopImageUrl ??
          HOME_PROMO_LEFT_DEFAULT_PATH
        }
        uploading={uploadingSlot === "floorMobile"}
        disabled={isBusy || !floor.promoLeft}
        previewClassName={MOBILE_FLOOR_PREVIEW_CLASS}
        previewRadiusClassName={PROMO_TILE_RADIUS_CLASS}
        onUpload={(file) => onUpload(floor.promoLeft, "floorMobile", file)}
      />
    </div>
  );
}
