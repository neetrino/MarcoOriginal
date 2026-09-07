"use client";

import { useState } from "react";

import { incrementReelViewAction } from "@/features/reels/application/manage-reels";
import type { StorefrontReel } from "@/features/reels/application/queries";
import { ReelFeedViewer } from "@/features/reels/ui/ReelFeedViewer";
import { ReelsGridTile } from "@/features/reels/ui/ReelsGridTile";

type ReelsPageGridProps = {
  playLabel: string;
  closeLabel: string;
  muteLabel: string;
  unmuteLabel: string;
  reels: StorefrontReel[];
};

/** Instagram-style reels index — 3 columns on mobile, denser on desktop. */
export function ReelsPageGrid({
  playLabel,
  closeLabel,
  muteLabel,
  unmuteLabel,
  reels,
}: ReelsPageGridProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

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
            onOpen={(opened) => setActiveId(opened.id)}
          />
        ))}
      </div>
      {activeId ? (
        <ReelFeedViewer
          reels={reels}
          initialReelId={activeId}
          closeLabel={closeLabel}
          muteLabel={muteLabel}
          unmuteLabel={unmuteLabel}
          onClose={() => setActiveId(null)}
          onActiveChange={(reelId) => {
            void incrementReelViewAction({ reelId });
          }}
        />
      ) : null}
    </>
  );
}
