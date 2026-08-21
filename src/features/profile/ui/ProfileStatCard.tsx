import type { ReactNode } from "react";

import { PROFILE_CARD_CLASS } from "@/features/profile/ui/profile-surface-classes";

export type ProfileStatTone = "blue" | "green" | "yellow" | "purple";

const STAT_TONES: Record<ProfileStatTone, { bg: string; fg: string }> = {
  blue: { bg: "bg-blue-100", fg: "text-blue-600" },
  green: { bg: "bg-green-100", fg: "text-green-600" },
  yellow: { bg: "bg-yellow-100", fg: "text-yellow-600" },
  purple: { bg: "bg-purple-100", fg: "text-purple-600" },
};

type ProfileStatCardProps = {
  label: string;
  value: string;
  icon: ReactNode;
  tone: ProfileStatTone;
};

export function ProfileStatCard({
  label,
  value,
  icon,
  tone,
}: ProfileStatCardProps) {
  const colors = STAT_TONES[tone];

  return (
    <div className={`${PROFILE_CARD_CLASS} p-6`}>
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-marco-slate/70">{label}</p>
          <p className="mt-1 break-words text-xl font-bold text-marco-slate sm:text-2xl">
            {value}
          </p>
        </div>
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full [&>svg]:h-6 [&>svg]:w-6 ${colors.bg} ${colors.fg}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
