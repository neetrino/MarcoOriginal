import { ArrowUpRight } from "lucide-react";

type HomeBannerCtaVariant = "yellow" | "slate";

type HomeBannerCtaProps = {
  label: string;
  variant: HomeBannerCtaVariant;
};

const PILL_CLASS: Record<HomeBannerCtaVariant, string> = {
  yellow: "bg-marco-yellow text-[#383838]",
  slate: "bg-marco-slate text-white",
};

const ICON_CLASS: Record<HomeBannerCtaVariant, string> = {
  yellow: "bg-marco-slate text-white",
  slate: "bg-marco-yellow text-marco-black",
};

/** Rest-state CTA pill matching the 3001 homepage floor banners. */
export function HomeBannerCta({ label, variant }: HomeBannerCtaProps) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex h-12 max-w-[170px] items-center justify-between gap-1.5 rounded-full pl-8 pr-1.5 text-[13px] font-bold leading-5 lg:max-w-[158px] lg:text-[15px] lg:leading-[22px] ${PILL_CLASS[variant]}`}
    >
      <span className="min-w-0 truncate">{label}</span>
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${ICON_CLASS[variant]}`}
      >
        <ArrowUpRight className="h-[18px] w-[18px]" strokeWidth={2.4} />
      </span>
    </span>
  );
}
