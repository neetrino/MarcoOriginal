"use client";

import { X } from "lucide-react";

import type { AdminReelListItem } from "@/features/reels/application/queries";

type ReelPreviewDialogProps = {
  reel: AdminReelListItem | null;
  onClose: () => void;
};

export function ReelPreviewDialog({ reel, onClose }: ReelPreviewDialogProps) {
  if (!reel?.videoUrl) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[210] flex items-center justify-center bg-black/70 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Preview ${reel.title}`}
    >
      <button
        type="button"
        className="absolute inset-0"
        aria-label="Close preview"
        onClick={onClose}
      />
      <div className="relative z-[1] w-full max-w-sm">
        <button
          type="button"
          onClick={onClose}
          className="absolute -right-2 -top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-900 shadow"
          aria-label="Close preview"
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
