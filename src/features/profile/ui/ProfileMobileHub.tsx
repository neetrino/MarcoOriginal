import { ProfileAccountPanel } from "@/features/profile/ui/ProfileAccountPanel";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import type { SessionUser } from "@/lib/auth/session";

type ProfileMobileHubProps = {
  locale: Locale;
  user: SessionUser;
  dictionary: Dictionary["profile"];
  homeLabel: string;
};

export function ProfileMobileHub({
  locale,
  user,
  dictionary,
  homeLabel,
}: ProfileMobileHubProps) {
  return (
    <ProfileAccountPanel
      locale={locale}
      user={user}
      dictionary={dictionary}
      homeLabel={homeLabel}
      variant="mobile"
    />
  );
}
