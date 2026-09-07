"use client";

import {
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { Volume2, VolumeX, X } from "lucide-react";

import type { StorefrontReel } from "@/features/reels/application/queries";
import { useIsClient } from "@/lib/react/use-is-client";

type ReelFeedViewerProps = {
  reels: StorefrontReel[];
  initialReelId: string;
  closeLabel: string;
  muteLabel: string;
  unmuteLabel: string;
  onClose: () => void;
  onActiveChange?: (reelId: string) => void;
};

/**
 * Full-screen Instagram-style vertical reel feed with snap scrolling.
 * Auto-plays the centered reel; mute starts on for browser autoplay rules.
 */
export function ReelFeedViewer({
  reels,
  initialReelId,
  closeLabel,
  muteLabel,
  unmuteLabel,
  onClose,
  onActiveChange,
}: ReelFeedViewerProps) {
  const mounted = useIsClient();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<Array<HTMLElement | null>>([]);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const onActiveChangeRef = useRef(onActiveChange);
  const onCloseRef = useRef(onClose);
  const viewedIdsRef = useRef(new Set<string>());
  const [activeIndex, setActiveIndex] = useState(() =>
    Math.max(
      0,
      reels.findIndex((reel) => reel.id === initialReelId),
    ),
  );
  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    onActiveChangeRef.current = onActiveChange;
  }, [onActiveChange]);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        onCloseRef.current();
        return;
      }
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        const delta = event.key === "ArrowDown" ? 1 : -1;
        const nextIndex = Math.min(
          Math.max(activeIndex + delta, 0),
          reels.length - 1,
        );
        slideRefs.current[nextIndex]?.scrollIntoView({ behavior: "smooth" });
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, reels.length]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    const startSlide = slideRefs.current[activeIndex];
    if (!scroller || !startSlide) return;
    scroller.scrollTop = startSlide.offsetTop;
  }, []);

  useEffect(() => {
    const slides = slideRefs.current.filter(
      (slide): slide is HTMLElement => slide !== null,
    );
    if (slides.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let best: { index: number; ratio: number } | null = null;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = Number(
            (entry.target as HTMLElement).dataset.reelIndex,
          );
          if (!Number.isFinite(index)) continue;
          if (!best || entry.intersectionRatio > best.ratio) {
            best = { index, ratio: entry.intersectionRatio };
          }
        }
        if (best && best.ratio >= 0.55) {
          setActiveIndex(best.index);
          setPaused(false);
        }
      },
      { root: scrollerRef.current, threshold: [0.55, 0.75, 0.9] },
    );

    for (const slide of slides) {
      observer.observe(slide);
    }
    return () => observer.disconnect();
  }, [reels.length]);

  useEffect(() => {
    const activeReel = reels[activeIndex];
    if (!activeReel) return;

    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      if (index === activeIndex) {
        video.muted = muted;
        if (!paused) {
          void video.play().catch(() => {
            setPaused(true);
          });
        } else {
          video.pause();
        }
        return;
      }
      video.pause();
      video.currentTime = 0;
    });

    if (!viewedIdsRef.current.has(activeReel.id)) {
      viewedIdsRef.current.add(activeReel.id);
      onActiveChangeRef.current?.(activeReel.id);
    }
  }, [activeIndex, muted, paused, reels]);

  if (!mounted || reels.length === 0) {
    return null;
  }

  const activeReel = reels[activeIndex] ?? reels[0];

  return createPortal(
    <div
      className="fixed inset-0 z-[210] bg-black"
      role="dialog"
      aria-modal="true"
      aria-label={activeReel?.title ?? "Reels"}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-3 right-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm"
        aria-label={closeLabel}
      >
        <X className="h-5 w-5" />
      </button>

      <button
        type="button"
        onClick={() => setMuted((value) => !value)}
        className="absolute top-3 left-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm"
        aria-label={muted ? unmuteLabel : muteLabel}
      >
        {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
      </button>

      <div
        ref={scrollerRef}
        className="h-full w-full snap-y snap-mandatory overflow-y-auto overscroll-y-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {reels.map((reel, index) => (
          <ReelFeedSlide
            key={reel.id}
            reel={reel}
            index={index}
            isActive={index === activeIndex}
            muted={muted}
            paused={paused}
            slideRefs={slideRefs}
            videoRefs={videoRefs}
            onTogglePause={() => setPaused((value) => !value)}
          />
        ))}
      </div>
    </div>,
    document.body,
  );
}

type ReelFeedSlideProps = {
  reel: StorefrontReel;
  index: number;
  isActive: boolean;
  muted: boolean;
  paused: boolean;
  slideRefs: RefObject<Array<HTMLElement | null>>;
  videoRefs: RefObject<Array<HTMLVideoElement | null>>;
  onTogglePause: () => void;
};

function ReelFeedSlide({
  reel,
  index,
  isActive,
  muted,
  paused,
  slideRefs,
  videoRefs,
  onTogglePause,
}: ReelFeedSlideProps) {
  return (
    <article
      ref={(node) => {
        slideRefs.current[index] = node;
      }}
      data-reel-index={index}
      className="relative flex h-dvh w-full shrink-0 snap-start snap-always items-center justify-center"
      aria-hidden={!isActive}
    >
      <button
        type="button"
        className="absolute inset-0 z-[1]"
        aria-label={paused ? "Play" : "Pause"}
        onClick={onTogglePause}
      />
      <video
        ref={(node) => {
          videoRefs.current[index] = node;
        }}
        src={reel.videoUrl}
        className="h-full w-full object-contain bg-black"
        playsInline
        loop
        muted={muted}
        preload={isActive ? "auto" : "metadata"}
        tabIndex={-1}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] bg-gradient-to-t from-black/70 via-black/20 to-transparent px-4 pb-8 pt-16"
        aria-hidden
      >
        <p className="line-clamp-2 text-sm font-semibold text-white sm:text-base">
          {reel.title}
        </p>
      </div>
      {isActive && paused ? (
        <div
          className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center"
          aria-hidden
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-black/45 text-white">
            <svg viewBox="0 0 24 24" className="h-7 w-7 translate-x-0.5" fill="currentColor">
              <path d="M8 5v14l11-7-11-7z" />
            </svg>
          </span>
        </div>
      ) : null}
    </article>
  );
}
