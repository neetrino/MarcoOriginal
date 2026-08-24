"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  ADMIN_PAGE_SUBTITLE,
  ADMIN_PAGE_TITLE,
} from "@/features/admin/ui/admin-form-classes";
import { getAdminCopy } from "@/features/admin/ui/get-admin-copy";
import { saveHeroSlideImageAction } from "@/features/hero/application/manage-hero-image";
import {
  pickHeroLayout,
  pickHomeFloorBanners,
  type HeroLayoutSlotKey,
  type HomeFloorSlotKey,
} from "@/features/hero/domain/hero-layout";
import type { HeroMediaRole } from "@/features/hero/domain/hero-media-role";
import type { AdminHeroSlideListItem } from "@/features/hero/application/queries";
import {
  AdminHeroDesktopFloorSections,
  AdminHeroMobileFloorSection,
} from "@/features/hero/ui/AdminHeroFloorSections";
import {
  HERO_DESKTOP_PREVIEW_CLASS,
  HERO_DESKTOP_RADIUS_CLASS,
  HERO_MOBILE_PREVIEW_CLASS,
  HERO_MOBILE_RADIUS_CLASS,
} from "@/features/hero/ui/hero-banner-classes";
import { HeroBannerImageField } from "@/features/hero/ui/HeroBannerImageField";
import {
  HeroBannerPlatformTabs,
  type HeroBannerPlatformTab,
} from "@/features/hero/ui/HeroBannerPlatformTabs";

type AdminHeroViewProps = {
  locale: string;
  slides: AdminHeroSlideListItem[];
};

type BannerUploadSlot = HeroLayoutSlotKey | HomeFloorSlotKey | "mobile" | "floorMobile";

type UploadingTarget = {
  slot: BannerUploadSlot;
} | null;

function roleForTab(tab: HeroBannerPlatformTab): HeroMediaRole {
  return tab === "mobile" ? "HERO_MOBILE" : "HERO_DESKTOP";
}

export function AdminHeroView({ locale, slides }: AdminHeroViewProps) {
  const router = useRouter();
  const copy = getAdminCopy(locale).hero;
  const common = getAdminCopy(locale).common;
  const layout = pickHeroLayout(slides);
  const floor = pickHomeFloorBanners(slides);
  const [activeTab, setActiveTab] = useState<HeroBannerPlatformTab>("desktop");
  const [uploading, setUploading] = useState<UploadingTarget>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const role = roleForTab(activeTab);
  const isBusy = uploading !== null || isPending;
  const isDesktop = activeTab === "desktop";

  function runUpload(
    slide: AdminHeroSlideListItem | null,
    slot: BannerUploadSlot,
    file: File,
  ): void {
    if (!slide) return;
    const formData = new FormData();
    formData.set("image", file);

    startTransition(async () => {
      setUploading({ slot });
      setError(null);
      setMessage(null);
      const result = await saveHeroSlideImageAction(
        locale,
        slide.id,
        role,
        formData,
      );
      setUploading(null);
      if (!result.ok) {
        setError(result.error.message);
        return;
      }
      setMessage(copy.uploaded);
      router.refresh();
    });
  }

  return (
    <section className="space-y-5">
      <div>
        <h1 className={ADMIN_PAGE_TITLE}>{copy.title}</h1>
        <p className={`mt-1 ${ADMIN_PAGE_SUBTITLE}`}>{copy.subtitle}</p>
      </div>

      <HeroBannerPlatformTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      {message ? <p className="text-sm text-green-700">{message}</p> : null}

      {isDesktop ? (
        <div
          id="admin-hero-banner-panel-desktop"
          role="tabpanel"
          aria-labelledby="admin-hero-banner-tab-desktop"
          className="space-y-5"
        >
          <Card className="border border-gray-100 bg-white/95 p-4 shadow-sm sm:p-6">
            <div className="mb-4 space-y-1">
              <h2 className="text-base font-semibold text-gray-900">
                {copy.homeHero}
              </h2>
            </div>
            <div className={`w-full min-w-0 ${HERO_DESKTOP_PREVIEW_CLASS}`}>
              <div className="grid h-full min-h-0 grid-cols-[minmax(0,1.24fr)_minmax(0,0.96fr)] gap-3 lg:gap-4">
                <div className="grid min-h-0 grid-rows-2 gap-3 lg:gap-4">
                  <HeroBannerImageField
                    label={copy.leftTop}
                    currentUrl={layout.leftTop?.desktopImageUrl ?? null}
                    uploading={uploading?.slot === "leftTop"}
                    disabled={isBusy || !layout.leftTop}
                    previewClassName="h-full w-full"
                    previewRadiusClassName={HERO_DESKTOP_RADIUS_CLASS}
                    fillCell
                    onUpload={(file) => runUpload(layout.leftTop, "leftTop", file)}
                  />
                  <HeroBannerImageField
                    label={copy.leftBottom}
                    currentUrl={layout.leftBottom?.desktopImageUrl ?? null}
                    uploading={uploading?.slot === "leftBottom"}
                    disabled={isBusy || !layout.leftBottom}
                    previewClassName="h-full w-full"
                    previewRadiusClassName={HERO_DESKTOP_RADIUS_CLASS}
                    fillCell
                    onUpload={(file) =>
                      runUpload(layout.leftBottom, "leftBottom", file)
                    }
                  />
                </div>
                <HeroBannerImageField
                  label={copy.rightColumn}
                  currentUrl={layout.right?.desktopImageUrl ?? null}
                  uploading={uploading?.slot === "right"}
                  disabled={isBusy || !layout.right}
                  previewClassName="h-full w-full"
                  previewRadiusClassName={HERO_DESKTOP_RADIUS_CLASS}
                  fillCell
                  onUpload={(file) => runUpload(layout.right, "right", file)}
                />
              </div>
            </div>
          </Card>
          <Card className="border border-gray-100 bg-white/95 p-4 shadow-sm sm:p-6">
            <AdminHeroDesktopFloorSections
              copy={copy}
              floor={floor}
              isBusy={isBusy}
              uploadingSlot={
                uploading &&
                (uploading.slot === "appDownload" ||
                  uploading.slot === "promoLeft" ||
                  uploading.slot === "promoRight")
                  ? uploading.slot
                  : null
              }
              onUpload={runUpload}
            />
          </Card>
        </div>
      ) : (
        <div
          id="admin-hero-banner-panel-mobile"
          role="tabpanel"
          aria-labelledby="admin-hero-banner-tab-mobile"
          className="mx-auto w-full max-w-md space-y-5"
        >
          <Card className="border border-gray-100 bg-white/95 p-4 shadow-sm sm:p-6">
            <div className="mb-4 space-y-1">
              <h2 className="text-base font-semibold text-gray-900">
                {copy.homeHero}
              </h2>
              <p className="text-sm text-gray-500">{copy.mobileHint}</p>
            </div>
            <HeroBannerImageField
              label={copy.heroBanner}
              currentUrl={
                layout.leftTop?.mobileImageUrl ??
                layout.leftTop?.desktopImageUrl ??
                null
              }
              uploading={uploading?.slot === "mobile"}
              disabled={isBusy || !layout.leftTop}
              previewClassName={HERO_MOBILE_PREVIEW_CLASS}
              previewRadiusClassName={HERO_MOBILE_RADIUS_CLASS}
              onUpload={(file) => runUpload(layout.leftTop, "mobile", file)}
            />
          </Card>
          <Card className="border border-gray-100 bg-white/95 p-4 shadow-sm sm:p-6">
            <AdminHeroMobileFloorSection
              copy={copy}
              floor={floor}
              isBusy={isBusy}
              uploadingSlot={
                uploading?.slot === "floorMobile" ? "floorMobile" : null
              }
              onUpload={runUpload}
            />
          </Card>
        </div>
      )}

      <div className="sticky bottom-4 z-10 rounded-2xl border border-gray-200 bg-white/90 p-3 shadow-lg backdrop-blur">
        <div className="flex flex-wrap justify-end gap-3">
          <Link
            href={`/${locale}/admin`}
            className="inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            {common.cancel}
          </Link>
          <Button
            type="button"
            disabled={isBusy}
            onClick={() => {
              setMessage(copy.saved);
              router.refresh();
            }}
          >
            {common.save}
          </Button>
        </div>
      </div>
    </section>
  );
}
