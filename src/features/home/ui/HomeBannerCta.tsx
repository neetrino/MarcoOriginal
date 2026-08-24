import type { CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";

import { HomeFloorBannerSlackCta } from "@/features/home/ui/HomeFloorBannerSlackCta";
import {
  HOME_BANNERS_CTA_ARROW_ICON_PX,
  HOME_BANNERS_CTA_HEIGHT_PX,
  HOME_BANNERS_CTA_ICON_CIRCLE_PX,
  HOME_BANNERS_CTA_ICON_PULL_LEFT_PX,
  HOME_BANNERS_CTA_LABEL_FONT_SIZE_PX,
  HOME_BANNERS_CTA_LABEL_ICON_GAP_PX,
  HOME_BANNERS_CTA_LABEL_LINE_HEIGHT_PX,
  HOME_BANNERS_CTA_PADDING_LEFT_PX,
  HOME_BANNERS_CTA_PADDING_RIGHT_PX,
  HOME_BANNERS_CTA_PILL_RADIUS_PX,
  HOME_BANNERS_CTA_WIDTH_PX,
  HOME_PROMO_LEFT_CTA_SLACK_HOVER_END_INSET_INLINE_START_PX,
  HOME_PROMO_RIGHT_CTA_ICON_MARGIN_LEFT_PX,
  HOME_PROMO_RIGHT_CTA_SLACK_HOVER_END_INSET_INLINE_START_PX,
} from "@/features/home/ui/home-banners-cta.constants";

type HomeBannerCtaVariant = "yellow" | "slate";

type HomeBannerCtaProps = {
  label: string;
  variant: HomeBannerCtaVariant;
  /** When the parent banner is already a link, render the pill without a nested anchor. */
  decorative?: boolean;
  href?: string;
  ariaLabel?: string;
};

const SLACK_MOTION_COLOR =
  "transition-colors [transition-duration:var(--slack-dur)] [transition-timing-function:var(--slack-ease)] motion-reduce:transition-none";

const linkStyleBase: CSSProperties = {
  height: HOME_BANNERS_CTA_HEIGHT_PX,
  minHeight: HOME_BANNERS_CTA_HEIGHT_PX,
  width: "100%",
  borderRadius: HOME_BANNERS_CTA_PILL_RADIUS_PX,
  paddingRight: HOME_BANNERS_CTA_PADDING_RIGHT_PX,
  gap: HOME_BANNERS_CTA_LABEL_ICON_GAP_PX,
  fontSize: HOME_BANNERS_CTA_LABEL_FONT_SIZE_PX,
  lineHeight: `${HOME_BANNERS_CTA_LABEL_LINE_HEIGHT_PX}px`,
};

const yellowLinkStyle: CSSProperties = {
  ...linkStyleBase,
  maxWidth: HOME_BANNERS_CTA_WIDTH_PX,
  paddingLeft: HOME_BANNERS_CTA_PADDING_LEFT_PX,
};

const slateLinkStyle: CSSProperties = {
  ...linkStyleBase,
  maxWidth: HOME_BANNERS_CTA_WIDTH_PX,
  paddingLeft: HOME_BANNERS_CTA_PADDING_LEFT_PX,
};

const slatePillClass =
  "max-w-[170px] pl-[34px] text-[13px] leading-5 lg:max-w-[158px] lg:pl-[26px] lg:text-[15px] lg:leading-[22px]";

/** Slack-hover CTA pill matching localhost:3001 homepage floor banners. */
export function HomeBannerCta({
  label,
  variant,
  decorative = false,
  href,
  ariaLabel,
}: HomeBannerCtaProps) {
  const sharedShellClass =
    "pointer-events-auto font-bold transition hover:-translate-y-0.5 active:translate-y-px";

  if (variant === "yellow") {
    return (
      <HomeFloorBannerSlackCta
        href={href}
        ariaLabel={ariaLabel}
        decorative={decorative}
        slackStopPad={`${HOME_PROMO_LEFT_CTA_SLACK_HOVER_END_INSET_INLINE_START_PX}px`}
        className={`${sharedShellClass} bg-marco-yellow text-[#383838] dark:text-[#383838]`}
        style={yellowLinkStyle}
        trailClassName="bg-marco-slate"
        labelWrapperClassName={`${SLACK_MOTION_COLOR} group-hover:text-white group-focus-visible:text-white dark:group-hover:text-white dark:group-focus-visible:text-white min-w-0 shrink whitespace-nowrap text-left translate-x-[-6px] lg:translate-x-[2px]`}
        label={<span>{label}</span>}
        chipInnerClassName={`flex shrink-0 items-center justify-center rounded-full bg-marco-slate text-white ${SLACK_MOTION_COLOR} group-hover:bg-marco-yellow group-hover:text-marco-black group-focus-visible:bg-marco-yellow group-focus-visible:text-marco-black dark:group-hover:bg-marco-yellow dark:group-hover:text-marco-black dark:group-focus-visible:bg-marco-yellow dark:group-focus-visible:text-marco-black lg:-translate-x-px`}
        chipInnerStyle={{
          width: HOME_BANNERS_CTA_ICON_CIRCLE_PX,
          height: HOME_BANNERS_CTA_ICON_CIRCLE_PX,
          marginLeft: -HOME_BANNERS_CTA_ICON_PULL_LEFT_PX,
        }}
        chipChildren={
          <ArrowUpRight
            width={HOME_BANNERS_CTA_ARROW_ICON_PX}
            height={HOME_BANNERS_CTA_ARROW_ICON_PX}
            strokeWidth={2.5}
          />
        }
      />
    );
  }

  return (
    <HomeFloorBannerSlackCta
      href={href}
      ariaLabel={ariaLabel}
      decorative={decorative}
      slackStopPad={`${HOME_PROMO_RIGHT_CTA_SLACK_HOVER_END_INSET_INLINE_START_PX}px`}
      className={`${sharedShellClass} bg-marco-slate text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marco-slate ${slatePillClass}`}
      style={slateLinkStyle}
      trailClassName="bg-marco-yellow"
      labelWrapperClassName={`${SLACK_MOTION_COLOR} group-hover:text-marco-black group-focus-visible:text-marco-black dark:group-hover:text-marco-black dark:group-focus-visible:text-marco-black min-w-0 shrink whitespace-nowrap text-left translate-x-[6px] lg:translate-x-[14px]`}
      label={<span>{label}</span>}
      chipInnerClassName={`flex shrink-0 items-center justify-center rounded-full bg-marco-yellow text-marco-black ${SLACK_MOTION_COLOR} group-hover:bg-marco-slate group-hover:text-white group-focus-visible:bg-marco-slate group-focus-visible:text-white lg:-translate-x-[3px]`}
      chipInnerStyle={{
        width: HOME_BANNERS_CTA_ICON_CIRCLE_PX,
        height: HOME_BANNERS_CTA_ICON_CIRCLE_PX,
        marginLeft: HOME_PROMO_RIGHT_CTA_ICON_MARGIN_LEFT_PX,
      }}
      chipChildren={
        <ArrowUpRight
          width={HOME_BANNERS_CTA_ARROW_ICON_PX}
          height={HOME_BANNERS_CTA_ARROW_ICON_PX}
          strokeWidth={2.5}
        />
      }
    />
  );
}
