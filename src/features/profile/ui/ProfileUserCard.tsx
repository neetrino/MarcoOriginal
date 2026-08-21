import type { SessionUser } from "@/lib/auth/session";
import { PROFILE_USER_CARD_CLASS } from "@/features/profile/ui/profile-surface-classes";

type ProfileUserCardProps = {
  user: SessionUser;
  title: string;
};

function displayName(user: SessionUser, fallback: string): string {
  const fullName = `${user.firstName} ${user.lastName}`.trim();
  return fullName || fallback;
}

function initials(user: SessionUser): string {
  return `${user.firstName.slice(0, 1)}${user.lastName.slice(0, 1)}`.toUpperCase();
}

export function ProfileUserCard({ user, title }: ProfileUserCardProps) {
  return (
    <section className={PROFILE_USER_CARD_CLASS} aria-label={title}>
      <div className="flex items-center gap-3.5">
        <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-gradient-to-br from-slate-100 to-slate-300 text-lg font-semibold text-marco-slate lg:h-24 lg:w-24 lg:text-2xl">
          {initials(user)}
        </div>
        <div className="min-w-0 flex-1 break-words">
          <h2 className="mb-0.5 break-words text-xl font-semibold leading-6 text-marco-slate lg:text-2xl lg:leading-7">
            {displayName(user, title)}
          </h2>
          <p className="break-words text-sm text-marco-slate/80 lg:text-base">
            {user.email}
          </p>
        </div>
      </div>
    </section>
  );
}
