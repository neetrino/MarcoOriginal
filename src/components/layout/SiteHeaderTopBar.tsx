import { HeaderContactCluster } from "@/components/layout/HeaderContactCluster";
import { HeaderPrimaryNav } from "@/components/layout/HeaderPrimaryNav";
import { HeaderSocialCircles } from "@/components/layout/HeaderSocialCircles";
import { MarcoLogo } from "@/components/layout/MarcoLogo";
import { SITE_HEADER_INNER } from "@/components/layout/site-header-classes";
import type { HeaderNavItem } from "@/components/layout/HeaderPrimaryNav";
import {
  buildContactLocations,
  buildContactPhoneSections,
} from "@/features/contact/content/contact-locations";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

type SiteHeaderTopBarProps = {
  locale: Locale;
  dictionary: Dictionary;
  navItems: readonly HeaderNavItem[];
};

/**
 * Desktop first stripe: logo, primary nav, socials, phone, addresses.
 */
export function SiteHeaderTopBar({
  locale,
  dictionary,
  navItems,
}: SiteHeaderTopBarProps) {
  const locations = buildContactLocations(dictionary.contact.locations);
  const phoneSections = buildContactPhoneSections(
    locations,
    dictionary.contact.deliveryPhonesLabel,
  );

  return (
    <div className="relative z-50 hidden border-b border-gray-200 bg-white min-[1180px]:block">
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
            dictionary={dictionary}
            variant="header"
            className="ml-8 min-[1367px]:ml-[54px] min-h-11 min-[1367px]:min-h-9"
          />
          <div className="ml-4 min-h-0 min-w-0 flex-1" aria-hidden />
        </div>
        <HeaderContactCluster
          locale={locale}
          phoneDisplay={dictionary.contact.storePhone}
          phoneSections={phoneSections}
          locations={locations}
          addressesLabel={dictionary.nav.addresses}
          storesLabel={dictionary.nav.stores}
          openInMapsLabel={dictionary.nav.openInMaps}
          choosePhoneLabel={dictionary.header.choosePhone}
          chooseAddressLabel={dictionary.header.chooseAddress}
        />
      </div>
    </div>
  );
}
