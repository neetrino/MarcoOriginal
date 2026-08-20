import { HeaderContactCluster } from "@/components/layout/HeaderContactCluster";
import { HeaderPrimaryNav } from "@/components/layout/HeaderPrimaryNav";
import { HeaderSocialCircles } from "@/components/layout/HeaderSocialCircles";
import { MarcoLogo } from "@/components/layout/MarcoLogo";
import { SITE_HEADER_INNER } from "@/components/layout/site-header-classes";
import type { HeaderNavItem } from "@/components/layout/HeaderPrimaryNav";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

type SiteHeaderTopBarProps = {
  locale: Locale;
  dictionary: Dictionary;
  navItems: readonly HeaderNavItem[];
};

/**
 * Desktop first stripe: logo, primary nav, socials, phone, address.
 */
export function SiteHeaderTopBar({
  locale,
  dictionary,
  navItems,
}: SiteHeaderTopBarProps) {
  return (
    <div className="hidden border-b border-gray-200 bg-white min-[1180px]:block">
      <div
        className={`${SITE_HEADER_INNER} flex w-full min-w-0 flex-nowrap items-center gap-x-2 py-2`}
      >
        <div className="flex min-w-0 flex-1 flex-nowrap items-center">
          <MarcoLogo locale={locale} ariaLabel={dictionary.header.logoHome} />
          <div className="ml-8 min-[1367px]:ml-[54px]">
            <HeaderPrimaryNav
              locale={locale}
              items={navItems}
              ariaLabel={dictionary.nav.navigation}
            />
          </div>
          <HeaderSocialCircles
            className="ml-8 min-[1367px]:ml-[54px]"
            instagramHref={dictionary.contact.social.instagram}
            facebookHref={dictionary.contact.social.facebook}
            telegramHref={dictionary.contact.social.telegram}
            ariaLabel={dictionary.header.socialLinks}
            instagramLabel="Instagram"
            facebookLabel="Facebook"
            telegramLabel="Telegram"
          />
          <div className="ml-4 min-h-0 min-w-0 flex-1" aria-hidden />
        </div>
        <HeaderContactCluster
          phone={dictionary.contact.storePhone}
          address={dictionary.contact.storeAddress}
        />
      </div>
    </div>
  );
}
