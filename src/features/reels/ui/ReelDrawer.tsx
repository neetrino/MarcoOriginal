"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { SideSheet } from "@/components/ui/SideSheet";
import {
  ADMIN_INPUT,
  ADMIN_LABEL,
} from "@/features/admin/ui/admin-form-classes";
import { createReelAction } from "@/features/reels/application/manage-reels";
import { MEDIA_VIDEO_MAX_BYTES } from "@/lib/media/video-file";
import { isLocale, type Locale } from "@/lib/i18n/config";

type ReelDrawerProps = {
  locale: string;
  open: boolean;
  onClose: () => void;
};

export function ReelDrawer({ locale, open, onClose }: ReelDrawerProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [prevOpen, setPrevOpen] = useState(open);

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setTitle("");
      setVideoFile(null);
      setVideoPreview(null);
      setError(null);
    }
  }

  function handleVideoChange(file: File | null): void {
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }
    if (!file) {
      setVideoFile(null);
      setVideoPreview(null);
      return;
    }
    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
  }

  return (
    <SideSheet
      open={open}
      onClose={onClose}
      ariaLabel="Add reel"
      panelClassName="w-full max-w-lg"
    >
      <div className="border-b border-gray-200 px-5 py-4">
        <h2 className="text-lg font-semibold text-gray-900">Add reel</h2>
      </div>

      <form
        className="flex min-h-0 flex-1 flex-col"
        onSubmit={(event) => {
          event.preventDefault();
          if (!videoFile) {
            setError("A video file is required.");
            return;
          }

          startTransition(async () => {
            setError(null);
            const mediaForm = new FormData();
            mediaForm.set("video", videoFile);
            const editingLocale: Locale = isLocale(locale) ? locale : "en";
            const result = await createReelAction(
              locale,
              { editingLocale, title },
              mediaForm,
            );
            if (!result.ok) {
              setError(result.error.message);
              return;
            }
            onClose();
            router.refresh();
          });
        }}
      >
        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
          <div>
            <label htmlFor="reel-title" className={ADMIN_LABEL}>
              Title
            </label>
            <input
              id="reel-title"
              className={ADMIN_INPUT}
              value={title}
              maxLength={200}
              placeholder="Untitled"
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>

          <div>
            <p className={ADMIN_LABEL}>Video</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/webm,video/quicktime"
              className="sr-only"
              onChange={(event) =>
                handleVideoChange(event.target.files?.[0] ?? null)
              }
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex w-full flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-sm text-gray-600 hover:border-gray-400 hover:bg-gray-100"
            >
              {videoFile
                ? videoFile.name
                : `Choose MP4, WebM, or MOV (max ${Math.floor(MEDIA_VIDEO_MAX_BYTES / (1024 * 1024))}MB)`}
            </button>
            {videoPreview ? (
              <video
                src={videoPreview}
                className="mt-3 aspect-[9/16] w-32 rounded-xl object-cover"
                muted
                playsInline
                controls
              />
            ) : null}
          </div>

          {error ? <p className="text-sm text-red-700">{error}</p> : null}
        </div>

        <div className="flex justify-end gap-2 border-t border-gray-200 px-5 py-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving…" : "Add reel"}
          </Button>
        </div>
      </form>
    </SideSheet>
  );
}
