"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  addHeroMobileImageAction,
  removeHeroMobileImageAction,
  reorderHeroMobileImagesAction,
} from "@/features/hero/application/manage-hero-image";
import type { AdminHeroSlideListItem } from "@/features/hero/application/queries";
import { AdminHeroMobileGallery } from "@/features/hero/ui/AdminHeroMobileGallery";

type MobileHomeCopy = {
  heroBanner: string;
  mobileCarouselHint: string;
  addMobileImage: string;
  removeMobileImage: string;
  moveMobileEarlier: string;
  moveMobileLater: string;
  mobileMaxReached: string;
  uploaded: string;
  removed: string;
  reordered: string;
};

type AdminHeroMobileHomeCardProps = {
  locale: string;
  slide: AdminHeroSlideListItem | null;
  copy: MobileHomeCopy;
  disabled: boolean;
  onBusyChange: (busy: boolean) => void;
  onMessage: (message: string) => void;
  onError: (message: string) => void;
};

/** Mobile home-hero carousel editor for the admin hero page. */
export function AdminHeroMobileHomeCard({
  locale,
  slide,
  copy,
  disabled,
  onBusyChange,
  onMessage,
  onError,
}: AdminHeroMobileHomeCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const images = slide?.mobileImages ?? [];

  function withBusy(run: () => Promise<void>): void {
    startTransition(async () => {
      onBusyChange(true);
      try {
        await run();
      } finally {
        onBusyChange(false);
      }
    });
  }

  function runAdd(file: File): void {
    if (!slide) return;
    const formData = new FormData();
    formData.set("image", file);

    withBusy(async () => {
      const result = await addHeroMobileImageAction(locale, slide.id, formData);
      if (!result.ok) {
        onError(result.error.message);
        return;
      }
      onMessage(copy.uploaded);
      router.refresh();
    });
  }

  function runRemove(mediaId: string): void {
    if (!slide) return;

    withBusy(async () => {
      const result = await removeHeroMobileImageAction(
        locale,
        slide.id,
        mediaId,
      );
      if (!result.ok) {
        onError(result.error.message);
        return;
      }
      onMessage(copy.removed);
      router.refresh();
    });
  }

  function runMove(mediaId: string, direction: -1 | 1): void {
    if (!slide) return;
    const ids = images.map((image) => image.id);
    const index = ids.indexOf(mediaId);
    const swapWith = index + direction;
    if (index < 0 || swapWith < 0 || swapWith >= ids.length) return;

    const next = [...ids];
    const currentId = next[index];
    const neighborId = next[swapWith];
    if (!currentId || !neighborId) return;
    next[index] = neighborId;
    next[swapWith] = currentId;

    const formData = new FormData();
    formData.set("orderedIds", JSON.stringify(next));

    withBusy(async () => {
      const result = await reorderHeroMobileImagesAction(
        locale,
        slide.id,
        formData,
      );
      if (!result.ok) {
        onError(result.error.message);
        return;
      }
      onMessage(copy.reordered);
      router.refresh();
    });
  }

  return (
    <AdminHeroMobileGallery
      label={copy.heroBanner}
      hint={copy.mobileCarouselHint}
      images={images}
      fallbackUrl={slide?.desktopImageUrl ?? null}
      disabled={disabled || !slide}
      uploading={isPending}
      onAdd={runAdd}
      onRemove={runRemove}
      onMove={runMove}
      addLabel={copy.addMobileImage}
      removeLabel={copy.removeMobileImage}
      moveEarlierLabel={copy.moveMobileEarlier}
      moveLaterLabel={copy.moveMobileLater}
      maxReachedLabel={copy.mobileMaxReached}
    />
  );
}
