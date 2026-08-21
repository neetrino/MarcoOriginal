"use client";

import { useState } from "react";
import { X } from "lucide-react";

import { incrementReelViewAction } from "@/features/reels/application/manage-reels";
import type { StorefrontReel } from "@/features/reels/application/queries";
import { chunkItems } from "@/features/home/paginate";
import { HomePaginationDots } from "@/features/home/ui/HomePaginationDots";
import { HomeSectionHeading } from "@/features/home/ui/HomeSectionHeading";
import { HOME_PAGE_SHELL_CLASS } from "@/features/home/ui/home-section-classes";
import {
  HOME_RAIL_TO_DOTS_GAP_PX,
  HOME_REELS_LABEL_FONT_SIZE_PX,
  HOME_REELS_TITLE_TO_RAIL_GAP_PX,
} from "@/features/home/ui/home-section.constants";
import { useIsMaxMd } from "@/features/home/ui/use-is-max-md";
import { useSnapCarousel } from "@/features/home/ui/use-snap-carousel";

const REELS_MOBILE_PAGE_SIZE = 3;
const REELS_DESKTOP_PAGE_SIZE = 6;

type HomeReelsProps = {
  title: string;
  playLabel: string;
  closeLabel: string;
  previousPageLabel: string;
  nextPageLabel: string;
  paginationLabel: string;
  reels: StorefrontReel[];
};

export function HomeReels({
  title,
  playLabel,
  closeLabel,
  previousPageLabel,
  nextPageLabel,
  paginationLabel,
  reels,
}: HomeReelsProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const isMaxMd = useIsMaxMd();
  const mobile = useSnapCarousel(
    Math.max(chunkItems(reels, REELS_MOBILE_PAGE_SIZE).length, 1),
  );
  const desktop = useSnapCarousel(
    Math.max(chunkItems(reels, REELS_DESKTOP_PAGE_SIZE).length, 1),
  );
  const carousel = isMaxMd ? mobile : desktop;
  const active = reels.find((reel) => reel.id === activeId) ?? null;

  if (reels.length === 0) return null;

  function openReel(reel: StorefrontReel): void {
    setActiveId(reel.id);
    void incrementReelViewAction({ reelId: reel.id });
  }

  return (
    <section className="bg-white py-8 sm:py-10" aria-labelledby="home-reels-heading">
      <div className={HOME_PAGE_SHELL_CLASS}>
        <div style={{ marginBottom: HOME_REELS_TITLE_TO_RAIL_GAP_PX }}>
          <HomeSectionHeading
            id="home-reels-heading"
            title={title}
            prevLabel={previousPageLabel}
            nextLabel={nextPageLabel}
            onPrev={() => carousel.scrollToPage(carousel.activePage - 1)}
            onNext={() => carousel.scrollToPage(carousel.activePage + 1)}
            canScrollPrev={carousel.canScrollPrev}
            canScrollNext={carousel.canScrollNext}
            accent="full"
            titleInsetClassName="md:pl-10"
          />
        </div>
        <div className="md:hidden">
          <HomeReelsPagedRail
            pages={chunkItems(reels, REELS_MOBILE_PAGE_SIZE)}
            playLabel={playLabel}
            scrollerRef={mobile.scrollerRef}
            onScroll={mobile.onScroll}
            onOpen={openReel}
          />
        </div>
        <div className="hidden md:block">
          <HomeReelsPagedRail
            pages={chunkItems(reels, REELS_DESKTOP_PAGE_SIZE)}
            playLabel={playLabel}
            scrollerRef={desktop.scrollerRef}
            onScroll={desktop.onScroll}
            onOpen={openReel}
          />
        </div>
        <div style={{ marginTop: HOME_RAIL_TO_DOTS_GAP_PX }}>
          <HomePaginationDots
            pageCount={
              isMaxMd
                ? chunkItems(reels, REELS_MOBILE_PAGE_SIZE).length
                : chunkItems(reels, REELS_DESKTOP_PAGE_SIZE).length
            }
            activePage={carousel.activePage}
            label={paginationLabel}
            onGoToPage={carousel.scrollToPage}
          />
        </div>
      </div>
      {active ? (
        <HomeReelDialog
          reel={active}
          closeLabel={closeLabel}
          onClose={() => setActiveId(null)}
        />
      ) : null}
    </section>
  );
}

type HomeReelsPagedRailProps = {
  pages: StorefrontReel[][];
  playLabel: string;
  scrollerRef: ReturnType<typeof useSnapCarousel>["scrollerRef"];
  onScroll: () => void;
  onOpen: (reel: StorefrontReel) => void;
};

function HomeReelsPagedRail({
  pages,
  playLabel,
  scrollerRef,
  onScroll,
  onOpen,
}: HomeReelsPagedRailProps) {
  return (
    <div
      ref={scrollerRef}
      onScroll={onScroll}
      className="flex min-w-0 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      style={{ scrollSnapType: "x mandatory" }}
    >
      {pages.map((page, pageIndex) => (
        <div
          key={`reels-page-${pageIndex}`}
          className="flex min-w-full shrink-0 snap-start justify-start gap-2 md:gap-11 md:pl-10"
        >
          {page.map((reel) => (
            <HomeReelTile
              key={reel.id}
              reel={reel}
              playLabel={playLabel}
              onOpen={onOpen}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function HomeReelTile({
  reel,
  playLabel,
  onOpen,
}: {
  reel: StorefrontReel;
  playLabel: string;
  onOpen: (reel: StorefrontReel) => void;
}) {
  const parts = reel.title.trim().split(/\s+/);
  const twoWords = parts.length === 2;

  return (
    <button
      type="button"
      title={reel.title}
      onClick={() => onOpen(reel)}
      className="group flex min-w-0 flex-1 flex-col items-center gap-2.5 text-center transition-transform duration-200 hover:-translate-y-0.5 md:min-w-[148px] md:flex-none"
      aria-label={`${playLabel}: ${reel.title}`}
    >
      <div className="relative h-[88px] w-[88px] shrink-0 overflow-hidden rounded-full border border-gray-200 bg-marco-gray shadow-[0_6px_16px_rgba(0,0,0,0.08)] transition-shadow group-hover:shadow-[0_12px_26px_rgba(0,0,0,0.18)] md:h-32 md:w-32">
        <video
          src={reel.videoUrl}
          className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
          muted
          playsInline
          preload="metadata"
          tabIndex={-1}
        />
      </div>
      <span
        className="hidden w-full font-medium text-marco-slate md:block md:whitespace-nowrap"
        style={{ fontSize: HOME_REELS_LABEL_FONT_SIZE_PX, lineHeight: "21px" }}
      >
        {twoWords ? (
          <>
            <span className="hidden md:inline">{reel.title}</span>
            <span className="flex flex-col items-center md:hidden">
              <span>{parts[0]}</span>
              <span>{parts[1]}</span>
            </span>
          </>
        ) : (
          reel.title
        )}
      </span>
    </button>
  );
}

function HomeReelDialog({
  reel,
  closeLabel,
  onClose,
}: {
  reel: StorefrontReel;
  closeLabel: string;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[210] flex items-center justify-center bg-black/80 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={reel.title}
    >
      <button type="button" className="absolute inset-0" aria-label={closeLabel} onClick={onClose} />
      <div className="relative z-[1] w-full max-w-sm">
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-2 -right-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-900 shadow"
          aria-label={closeLabel}
        >
          <X className="h-4 w-4" />
        </button>
        <video
          src={reel.videoUrl}
          className="aspect-[9/16] w-full rounded-2xl bg-black object-contain"
          controls
          autoPlay
          playsInline
        />
      </div>
    </div>
  );
}
