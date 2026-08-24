import type { CSSProperties, ReactNode } from "react";

import { AppLink } from "@/components/ui/AppLink";
import {
  HOME_BANNERS_CTA_ICON_CIRCLE_PX,
  HOME_BANNERS_CTA_LABEL_ICON_GAP_PX,
  HOME_BANNERS_CTA_PADDING_LEFT_PX,
  HOME_BANNERS_CTA_SLACK_HOVER_END_INSET_PX,
  HOME_BANNERS_CTA_SLACK_LABEL_SHIFT_ON_HOVER_PX,
  HOME_BANNERS_CTA_SLACK_MOTION_DURATION_MS,
  HOME_BANNERS_CTA_SLACK_MOTION_EASING_CSS,
  HOME_BANNERS_CTA_SLACK_TRAVEL_MICRO_PX,
} from "@/features/home/ui/home-banners-cta.constants";

function slackBleedStartFromStyle(linkStyle?: CSSProperties): string {
  const pl = linkStyle?.paddingLeft;
  if (typeof pl === "number" && Number.isFinite(pl)) {
    return `${pl}px`;
  }
  if (typeof pl === "string" && pl.trim() !== "") {
    return pl;
  }
  return `${HOME_BANNERS_CTA_PADDING_LEFT_PX}px`;
}

type HomeFloorBannerSlackCtaProps = {
  href?: string;
  ariaLabel?: string;
  /** When true, renders a non-interactive shell (for use inside an outer banner link). */
  decorative?: boolean;
  className: string;
  style?: CSSProperties;
  /** Expanding fill behind the label (e.g. `bg-marco-slate`). */
  trailClassName: string;
  /** Applied to the label wrapper (e.g. `group-hover:text-white`). */
  labelWrapperClassName: string;
  label: ReactNode;
  /** Inner pill around the arrow — sizing, colors, per-locale nudges. */
  chipInnerClassName: string;
  chipInnerStyle?: CSSProperties;
  chipChildren: ReactNode;
  slackStopPad?: string;
  slackStopPadClassName?: string;
  slackChipRestInsetInlineEndPx?: number;
};

/**
 * Floor-banner CTA slack hover: chip travels toward inline-start while a trail wipes the pill.
 */
export function HomeFloorBannerSlackCta({
  href,
  ariaLabel,
  decorative = false,
  className,
  style,
  trailClassName,
  labelWrapperClassName,
  label,
  chipInnerClassName,
  chipInnerStyle,
  chipChildren,
  slackStopPad = `${HOME_BANNERS_CTA_SLACK_HOVER_END_INSET_PX}px`,
  slackStopPadClassName,
  slackChipRestInsetInlineEndPx,
}: HomeFloorBannerSlackCtaProps) {
  const trackPadEnd =
    HOME_BANNERS_CTA_ICON_CIRCLE_PX + HOME_BANNERS_CTA_LABEL_ICON_GAP_PX;

  const mergedStyle: CSSProperties = {
    ...(style ?? {}),
    ["--slack-dur" as string]: `${HOME_BANNERS_CTA_SLACK_MOTION_DURATION_MS}ms`,
    ["--slack-ease" as string]: HOME_BANNERS_CTA_SLACK_MOTION_EASING_CSS,
    ["--slack-track-pe" as string]: `${trackPadEnd}px`,
    ["--slack-bleed-start" as string]: slackBleedStartFromStyle(style),
    ["--slack-travel-micro" as string]: `${HOME_BANNERS_CTA_SLACK_TRAVEL_MICRO_PX}px`,
    ["--slack-label-shift" as string]: `${HOME_BANNERS_CTA_SLACK_LABEL_SHIFT_ON_HOVER_PX}px`,
    ...(slackStopPadClassName
      ? {}
      : { ["--slack-stop-pad" as string]: slackStopPad }),
  };

  const motionTransform =
    "transform-gpu transition-transform [transition-duration:var(--slack-dur)] [transition-timing-function:var(--slack-ease)] motion-reduce:transition-none";

  const motionTrail = `pointer-events-none absolute inset-0 z-[1] origin-right scale-x-0 ${motionTransform} group-hover:scale-x-100 group-focus-visible:scale-x-100`;

  const motionChipOuter =
    slackChipRestInsetInlineEndPx != null &&
    Number.isFinite(slackChipRestInsetInlineEndPx)
      ? "absolute top-1/2 z-[4] flex -translate-y-1/2 group-hover:z-[3] group-focus-visible:z-[3]"
      : "absolute end-0 top-1/2 z-[4] flex -translate-y-1/2 group-hover:z-[3] group-focus-visible:z-[3]";

  const motionChipInner = `${motionTransform} group-hover:translate-x-[calc(-100cqw+100%+var(--slack-stop-pad)-var(--slack-track-pe)-var(--slack-bleed-start)-var(--slack-travel-micro))] group-focus-visible:translate-x-[calc(-100cqw+100%+var(--slack-stop-pad)-var(--slack-track-pe)-var(--slack-bleed-start)-var(--slack-travel-micro))]`;

  const labelMotionShift =
    "inline-block min-w-0 max-w-full transform-gpu transition-transform [transition-duration:var(--slack-dur)] [transition-timing-function:var(--slack-ease)] motion-reduce:transition-none group-hover:translate-x-[var(--slack-label-shift)] group-focus-visible:translate-x-[var(--slack-label-shift)] motion-reduce:group-hover:translate-x-0 motion-reduce:group-focus-visible:translate-x-0";

  const chipRestInsetStyle: CSSProperties | undefined =
    slackChipRestInsetInlineEndPx != null &&
    Number.isFinite(slackChipRestInsetInlineEndPx)
      ? {
          insetInlineEnd: slackChipRestInsetInlineEndPx,
          insetInlineStart: "auto",
        }
      : undefined;

  const sharedClassName = `group relative isolate flex w-full max-w-full shrink-0 items-stretch overflow-hidden ${slackStopPadClassName ?? ""} ${className}`;

  const inner = (
    <>
      <span aria-hidden className={`${motionTrail} ${trailClassName}`} />
      <div
        className="relative z-[2] flex min-h-0 min-w-0 flex-1 items-center [container-type:inline-size]"
        style={{ paddingInlineEnd: trackPadEnd }}
      >
        <span
          className={`relative z-[2] min-w-0 shrink group-hover:z-[20] group-focus-visible:z-[20] ${labelWrapperClassName}`}
        >
          <span className={labelMotionShift}>{label}</span>
        </span>
        <span className={motionChipOuter} style={chipRestInsetStyle} aria-hidden>
          <span className={motionChipInner}>
            <span className={chipInnerClassName} style={chipInnerStyle}>
              {chipChildren}
            </span>
          </span>
        </span>
      </div>
    </>
  );

  if (decorative || !href) {
    return (
      <span aria-hidden className={sharedClassName} style={mergedStyle}>
        {inner}
      </span>
    );
  }

  return (
    <AppLink
      href={href}
      prefetchPolicy="intent"
      aria-label={ariaLabel}
      className={sharedClassName}
      style={mergedStyle}
    >
      {inner}
    </AppLink>
  );
}
