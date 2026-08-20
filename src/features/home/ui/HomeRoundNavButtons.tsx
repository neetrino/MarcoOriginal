import { ChevronLeft, ChevronRight } from "lucide-react";

import {
  HOME_NAV_BUTTON_CLASS,
  HOME_NAV_ICON_CLASS,
} from "@/features/home/ui/home-section-classes";

type HomeRoundNavButtonsProps = {
  prevLabel: string;
  nextLabel: string;
  onPrev: () => void;
  onNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
};

export function HomeRoundNavButtons({
  prevLabel,
  nextLabel,
  onPrev,
  onNext,
  canScrollPrev,
  canScrollNext,
}: HomeRoundNavButtonsProps) {
  return (
    <div className="flex shrink-0 flex-row gap-2">
      <button
        type="button"
        onClick={onPrev}
        disabled={!canScrollPrev}
        className={HOME_NAV_BUTTON_CLASS}
        aria-label={prevLabel}
      >
        <ChevronLeft className={HOME_NAV_ICON_CLASS} strokeWidth={2} />
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={!canScrollNext}
        className={HOME_NAV_BUTTON_CLASS}
        aria-label={nextLabel}
      >
        <ChevronRight className={HOME_NAV_ICON_CLASS} strokeWidth={2} />
      </button>
    </div>
  );
}
