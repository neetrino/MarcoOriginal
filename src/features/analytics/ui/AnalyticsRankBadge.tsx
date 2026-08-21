import { analyticsRankClass } from "@/features/analytics/domain/analytics-display";

type AnalyticsRankBadgeProps = {
  rank: number;
  muted?: boolean;
};

export function AnalyticsRankBadge({ rank, muted = false }: AnalyticsRankBadgeProps) {
  const tone = muted
    ? "bg-gray-200 text-gray-700"
    : analyticsRankClass(rank);

  return (
    <div
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${tone}`}
    >
      {rank}
    </div>
  );
}
