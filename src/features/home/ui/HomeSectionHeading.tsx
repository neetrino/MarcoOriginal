import { HomeRoundNavButtons } from "@/features/home/ui/HomeRoundNavButtons";
import { HOME_TITLE_CLASS } from "@/features/home/ui/home-section-classes";
import {
  HOME_TITLE_BAR_STUB_PERCENT,
  HOME_TITLE_BAR_THICKNESS_PX,
  HOME_TITLE_TEXT_TO_BAR_GAP_PX,
  HOME_REELS_BAR_EXTEND_RIGHT_PX,
} from "@/features/home/ui/home-section.constants";

type HomeSectionHeadingProps = {
  id: string;
  title: string;
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
  prevLabel,
  nextLabel,
  onPrev,
  onNext,
  canScrollPrev,
  canScrollNext,
  accent = "stub",
  titleInsetClassName = "",
}: HomeSectionHeadingProps) {
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

  return (
    <div className="flex flex-row flex-wrap items-end justify-between gap-4">
      <div className={`min-w-0 ${titleInsetClassName}`}>
        <h2 id={id} className={HOME_TITLE_CLASS}>
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
        </h2>
      </div>
      <HomeRoundNavButtons
        prevLabel={prevLabel}
        nextLabel={nextLabel}
        onPrev={onPrev}
        onNext={onNext}
        canScrollPrev={canScrollPrev}
        canScrollNext={canScrollNext}
      />
    </div>
  );
}
