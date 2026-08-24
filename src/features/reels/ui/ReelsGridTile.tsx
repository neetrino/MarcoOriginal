"use client";

import type { StorefrontReel } from "@/features/reels/application/queries";
import { reelThumbnailSrc } from "@/features/reels/domain/reel-rules";

type ReelsGridTileProps = {
  reel: StorefrontReel;
  playLabel: string;
  priority: boolean;
  onOpen: (reel: StorefrontReel) => void;
};

/** Single reels grid cell — 9:16 poster with play affordance. */
export function ReelsGridTile({
  reel,
  playLabel,
  priority,
  onOpen,
}: ReelsGridTileProps) {
  return (
    <button
      type="button"
      role="listitem"
      onClick={() => onOpen(reel)}
      aria-label={`${playLabel}: ${reel.title}`}
      className="group relative block aspect-[9/16] w-full overflow-hidden bg-zinc-900 outline-none transition-transform duration-200 hover:scale-[1.015] focus-visible:z-[1] focus-visible:ring-2 focus-visible:ring-marco-ink/80 focus-visible:ring-offset-2"
    >
      <video
        src={reelThumbnailSrc(reel.videoUrl)}
        className="absolute inset-0 h-full w-full object-cover object-center transition duration-500 group-hover:scale-[1.03]"
        muted
        playsInline
        preload={priority ? "auto" : "metadata"}
        tabIndex={-1}
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/55 text-white"
        aria-hidden
      >
        <svg viewBox="0 0 24 24" className="h-3 w-3 translate-x-px" fill="currentColor">
          <path d="M8 5v14l11-7-11-7z" />
        </svg>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 px-1.5 pb-1.5 pt-8">
        <p className="line-clamp-2 text-left text-[9px] font-semibold leading-snug text-white sm:text-[10px]">
          {reel.title}
        </p>
      </div>
    </button>
  );
}
