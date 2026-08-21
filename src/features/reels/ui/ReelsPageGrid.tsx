"use client";

import { useState } from "react";
import { X } from "lucide-react";

import { incrementReelViewAction } from "@/features/reels/application/manage-reels";
import type { StorefrontReel } from "@/features/reels/application/queries";
import { ReelsGridTile } from "@/features/reels/ui/ReelsGridTile";

type ReelsPageGridProps = {
  playLabel: string;
  closeLabel: string;
  reels: StorefrontReel[];
};

/** Instagram-style reels index — 3 columns on mobile, denser on desktop. */
export function ReelsPageGrid({
  playLabel,
  closeLabel,
  reels,
}: ReelsPageGridProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = reels.find((reel) => reel.id === activeId) ?? null;

  function openReel(reel: StorefrontReel): void {
    setActiveId(reel.id);
    void incrementReelViewAction({ reelId: reel.id });
  }

  return (
    <>
      <div
        className="grid grid-cols-3 gap-px sm:gap-1 md:grid-cols-4 lg:grid-cols-5"
        role="list"
      >
        {reels.map((reel, index) => (
          <ReelsGridTile
            key={reel.id}
            reel={reel}
            playLabel={playLabel}
            priority={index < 6}
            onOpen={openReel}
          />
        ))}
      </div>
      {active ? (
        <ReelPlayerDialog
          reel={active}
          closeLabel={closeLabel}
          onClose={() => setActiveId(null)}
        />
      ) : null}
    </>
  );
}

function ReelPlayerDialog({
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
