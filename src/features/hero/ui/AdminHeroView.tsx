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
import { saveHeroSlideImageAction } from "@/features/hero/application/manage-hero-image";
import {
  pickHeroLayout,
  type HeroLayoutSlotKey,
} from "@/features/hero/domain/hero-layout";
import type { HeroMediaRole } from "@/features/hero/domain/hero-media-role";
import type { AdminHeroSlideListItem } from "@/features/hero/application/queries";
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

type UploadingTarget = {
  slot: HeroLayoutSlotKey | "mobile";
} | null;

function roleForTab(tab: HeroBannerPlatformTab): HeroMediaRole {
  return tab === "mobile" ? "HERO_MOBILE" : "HERO_DESKTOP";
}

export function AdminHeroView({ locale, slides }: AdminHeroViewProps) {
  const router = useRouter();
  const layout = pickHeroLayout(slides);
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
    slot: HeroLayoutSlotKey | "mobile",
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
      setMessage(
        "Image uploaded to storage and saved. It will show on the storefront shortly.",
      );
      router.refresh();
    });
  }

  return (
    <section className="space-y-5">
      <div>
        <h1 className={ADMIN_PAGE_TITLE}>Hero / Banner</h1>
        <p className={`mt-1 ${ADMIN_PAGE_SUBTITLE}`}>
          Manage desktop and mobile images for the homepage hero banner
        </p>
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
              <h2 className="text-base font-semibold text-gray-900">Home hero</h2>
            </div>
            <div className={`w-full min-w-0 ${HERO_DESKTOP_PREVIEW_CLASS}`}>
              <div className="grid h-full min-h-0 grid-cols-[minmax(0,1.24fr)_minmax(0,0.96fr)] gap-3 lg:gap-4">
                <div className="grid min-h-0 grid-rows-2 gap-3 lg:gap-4">
                  <HeroBannerImageField
                    label="Left, top"
                    currentUrl={layout.leftTop?.desktopImageUrl ?? null}
                    uploading={uploading?.slot === "leftTop"}
                    disabled={isBusy || !layout.leftTop}
                    previewClassName="h-full w-full"
                    previewRadiusClassName={HERO_DESKTOP_RADIUS_CLASS}
                    fillCell
                    onUpload={(file) => runUpload(layout.leftTop, "leftTop", file)}
                  />
                  <HeroBannerImageField
                    label="Left, bottom"
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
                  label="Right column"
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
              <h2 className="text-base font-semibold text-gray-900">Home hero</h2>
              <p className="text-sm text-gray-500">
                Full-width banner at the top of the mobile home page.
              </p>
            </div>
            <HeroBannerImageField
              label="Hero banner"
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
        </div>
      )}

      <div className="sticky bottom-4 z-10 rounded-2xl border border-gray-200 bg-white/90 p-3 shadow-lg backdrop-blur">
        <div className="flex flex-wrap justify-end gap-3">
          <Link
            href={`/${locale}/admin`}
            className="inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </Link>
          <Button
            type="button"
            disabled={isBusy}
            onClick={() => {
              setMessage("Hero banner images saved successfully.");
              router.refresh();
            }}
          >
            Save
          </Button>
        </div>
      </div>
    </section>
  );
}
