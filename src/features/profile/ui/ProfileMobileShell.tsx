"use client";

import {
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";

import { ProfileMobileHub } from "@/features/profile/ui/ProfileMobileHub";
import { ProfileMobileTabSheet } from "@/features/profile/ui/ProfileMobileTabSheet";
import {
  buildProfileNavItems,
  getProfileSectionTitle,
} from "@/features/profile/ui/profile-nav-items";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import type { SessionUser } from "@/lib/auth/session";

type ProfileMobileShellProps = {
  locale: Locale;
  user: SessionUser;
  dictionary: Dictionary["profile"];
  homeLabel: string;
  children: ReactNode;
};

function isProfileHubPath(pathname: string, locale: Locale): boolean {
  const hubHref = `/${locale}/profile`;
  return pathname === hubHref || pathname === `${hubHref}/`;
}

/**
 * Mobile profile shell: hub always visible; section content in a bottom sheet.
 * Desktop content column is unchanged (`lg+`).
 */
export function ProfileMobileShell({
  locale,
  user,
  dictionary,
  homeLabel,
  children,
}: ProfileMobileShellProps) {
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const isHub = isProfileHubPath(pathname, locale);
  const [closingToHub, setClosingToHub] = useState(false);
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);
  const [prevIsHub, setPrevIsHub] = useState(isHub);
  const [prevPathname, setPrevPathname] = useState(pathname);
  const sheetTitle = getProfileSectionTitle(
    pathname,
    buildProfileNavItems(locale, dictionary),
    dictionary.title,
  );

  if (isHub !== prevIsHub || pathname !== prevPathname) {
    setPrevIsHub(isHub);
    setPrevPathname(pathname);
    if (isHub) {
      setClosingToHub(false);
    }
  }

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    function sync(): void {
      setIsDesktop(media.matches);
    }
    const frame = requestAnimationFrame(sync);
    media.addEventListener("change", sync);
    return () => {
      cancelAnimationFrame(frame);
      media.removeEventListener("change", sync);
    };
  }, []);

  const sheetOpen = !isHub && !closingToHub;

  const closeSheet = useCallback(() => {
    setClosingToHub(true);
  }, []);

  const handleSheetExited = useCallback(() => {
    if (!closingToHub) return;
    router.push(`/${locale}/profile`);
  }, [closingToHub, locale, router]);

  const hub = (
    <ProfileMobileHub
      locale={locale}
      user={user}
      dictionary={dictionary}
      homeLabel={homeLabel}
    />
  );

  if (isDesktop === null) {
    return (
      <>
        <div className="profile-mobile-page w-full lg:hidden">{hub}</div>
        <div className="hidden min-w-0 flex-1 lg:block">{children}</div>
      </>
    );
  }

  if (isDesktop) {
    return <div className="min-w-0 flex-1">{children}</div>;
  }

  return (
    <div className="profile-mobile-page w-full">
      {hub}
      <ProfileMobileTabSheet
        open={sheetOpen}
        onClose={closeSheet}
        onExited={handleSheetExited}
        ariaLabel={sheetTitle}
        title={sheetTitle}
        closeLabel={dictionary.closeSheet}
      >
        {children}
      </ProfileMobileTabSheet>
    </div>
  );
}
