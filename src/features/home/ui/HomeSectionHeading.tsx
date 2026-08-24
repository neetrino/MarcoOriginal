import type { CSSProperties } from "react";

import { HomeRoundNavButtons } from "@/features/home/ui/HomeRoundNavButtons";
import { HOME_TITLE_CLASS } from "@/features/home/ui/home-section-classes";
import {
  HOME_REELS_BAR_EXTEND_RIGHT_PX,
  HOME_SPECIAL_OFFERS_NAV_INSET_RIGHT_DESKTOP_PX,
  HOME_SPECIAL_OFFERS_NAV_INSET_RIGHT_MOBILE_PX,
  HOME_SPECIAL_OFFERS_TITLE_HIGHLIGHT_UNDERLINE_GAP_PX,
  HOME_SPECIAL_OFFERS_TITLE_HIGHLIGHT_UNDERLINE_HEIGHT_PX,
  HOME_SPECIAL_OFFERS_TITLE_HIGHLIGHT_UNDERLINE_WIDTH_PERCENT,
  HOME_SPECIAL_OFFERS_TITLE_INSET_LEFT_PX,
  HOME_TITLE_BAR_STUB_PERCENT,
  HOME_TITLE_BAR_THICKNESS_PX,
  HOME_TITLE_TEXT_TO_BAR_GAP_PX,
  HOME_NAV_BUTTON_HEIGHT_MOBILE_PX,
  HOME_NAV_BUTTON_HEIGHT_PX,
  HOME_NAV_BUTTON_WIDTH_MOBILE_PX,
  HOME_NAV_BUTTON_WIDTH_PX,
} from "@/features/home/ui/home-section.constants";

type HomeSectionHeadingProps = {
  id: string;
  title: string;
  titleHighlight?: string;
  titleRest?: string;
  prevLabel: string;
  nextLabel: string;
  onPrev: () => void;
  onNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  accent?: "stub" | "full";
  titleInsetClassName?: string;
};

export function HomeSectionHeading({
  id,
  title,
  titleHighlight,
  titleRest,
  prevLabel,
  nextLabel,
  onPrev,
  onNext,
  canScrollPrev,
  canScrollNext,
  accent = "stub",
  titleInsetClassName = "",
}: HomeSectionHeadingProps) {
  const shellStyle = {
    ["--home-nav-btn-w-mobile" as string]: `${HOME_NAV_BUTTON_WIDTH_MOBILE_PX}px`,
    ["--home-nav-btn-h-mobile" as string]: `${HOME_NAV_BUTTON_HEIGHT_MOBILE_PX}px`,
    ["--home-nav-btn-w" as string]: `${HOME_NAV_BUTTON_WIDTH_PX}px`,
    ["--home-nav-btn-h" as string]: `${HOME_NAV_BUTTON_HEIGHT_PX}px`,
    ["--home-nav-inset-mobile" as string]: `${HOME_SPECIAL_OFFERS_NAV_INSET_RIGHT_MOBILE_PX}px`,
    ["--home-nav-inset-desktop" as string]: `${HOME_SPECIAL_OFFERS_NAV_INSET_RIGHT_DESKTOP_PX}px`,
  } as CSSProperties;

  const barStyle =
    accent === "full"
      ? {
          left: 0,
          width: `calc(100% + ${HOME_REELS_BAR_EXTEND_RIGHT_PX}px)`,
          height: HOME_TITLE_BAR_THICKNESS_PX,
        }
      : {
          left: 0,
          width: `${HOME_TITLE_BAR_STUB_PERCENT}%`,
          height: HOME_TITLE_BAR_THICKNESS_PX,
        };

  const useSplitTitle =
    titleHighlight != null &&
    titleRest != null &&
    titleHighlight.trim().length > 0;

  return (
    <div
      className="flex flex-row flex-wrap items-end justify-between gap-4"
      style={shellStyle}
    >
      <div
        className={`min-w-0 max-w-full ${titleInsetClassName}`}
        style={
          useSplitTitle
            ? { paddingLeft: HOME_SPECIAL_OFFERS_TITLE_INSET_LEFT_PX }
            : undefined
        }
      >
        <h2 id={id} className={HOME_TITLE_CLASS}>
          {useSplitTitle ? (
            <>
              <span className="max-md:hidden">
                <span className="relative inline-block text-marco-yellow">
                  {titleHighlight}
                  <span
                    aria-hidden
                    className="absolute left-0 bg-marco-yellow"
                    style={{
                      top: "100%",
                      marginTop: HOME_SPECIAL_OFFERS_TITLE_HIGHLIGHT_UNDERLINE_GAP_PX,
                      width: `${HOME_SPECIAL_OFFERS_TITLE_HIGHLIGHT_UNDERLINE_WIDTH_PERCENT}%`,
                      height: HOME_SPECIAL_OFFERS_TITLE_HIGHLIGHT_UNDERLINE_HEIGHT_PX,
                    }}
                  />
                </span>
                <span>{titleRest}</span>
              </span>
              <span className="flex flex-col items-start md:hidden">
                <span className="text-marco-yellow">{titleHighlight.trim()}</span>
                <span
                  className="relative mt-0.5 inline-block text-marco-black"
                  style={{
                    paddingBottom:
                      HOME_SPECIAL_OFFERS_TITLE_HIGHLIGHT_UNDERLINE_GAP_PX +
                      HOME_SPECIAL_OFFERS_TITLE_HIGHLIGHT_UNDERLINE_HEIGHT_PX,
                  }}
                >
                  {titleRest.trim()}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute bottom-0 left-0 bg-marco-yellow"
                    style={{
                      width: `${HOME_SPECIAL_OFFERS_TITLE_HIGHLIGHT_UNDERLINE_WIDTH_PERCENT}%`,
                      height: HOME_SPECIAL_OFFERS_TITLE_HIGHLIGHT_UNDERLINE_HEIGHT_PX,
                    }}
                  />
                </span>
              </span>
            </>
          ) : (
            <span
              className="relative inline-block whitespace-nowrap"
              style={{
                paddingBottom:
                  HOME_TITLE_TEXT_TO_BAR_GAP_PX + HOME_TITLE_BAR_THICKNESS_PX,
              }}
            >
              {title}
              <span
                aria-hidden
                className="pointer-events-none absolute bottom-0 bg-marco-yellow"
                style={barStyle}
              />
            </span>
          )}
        </h2>
      </div>
      <div className="flex shrink-0 flex-row gap-2 max-md:[margin-right:var(--home-nav-inset-mobile)] md:[margin-right:var(--home-nav-inset-desktop)]">
        <HomeRoundNavButtons
          prevLabel={prevLabel}
          nextLabel={nextLabel}
          onPrev={onPrev}
          onNext={onNext}
          canScrollPrev={canScrollPrev}
          canScrollNext={canScrollNext}
        />
      </div>
    </div>
  );
}
