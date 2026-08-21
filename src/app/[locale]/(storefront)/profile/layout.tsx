import { notFound } from "next/navigation";

import { ProfileMobileShell } from "@/features/profile/ui/ProfileMobileShell";
import { ProfileSidebar } from "@/features/profile/ui/ProfileSidebar";
import { requireUser } from "@/lib/auth/policies";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

type ProfileLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function ProfileLayout({
  children,
  params,
}: ProfileLayoutProps) {
  const { locale: rawLocale } = await params;

  if (!isLocale(rawLocale)) {
    notFound();
  }

  const user = await requireUser(rawLocale);
  const dictionary = getDictionary(rawLocale);

  return (
    <div className="profile-desktop-page flex w-full flex-col gap-2 lg:flex-row lg:items-start lg:gap-12 lg:pb-0">
      <div className="hidden w-full shrink-0 lg:sticky lg:top-6 lg:block lg:w-[27rem] lg:self-start">
        <ProfileSidebar
          locale={rawLocale}
          user={user}
          dictionary={dictionary.profile}
          homeLabel={dictionary.nav.home}
        />
      </div>

      <ProfileMobileShell
        locale={rawLocale}
        user={user}
        dictionary={dictionary.profile}
        homeLabel={dictionary.nav.home}
      >
        {children}
      </ProfileMobileShell>
    </div>
  );
}
