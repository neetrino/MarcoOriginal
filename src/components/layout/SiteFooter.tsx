import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";

import { FooterPaymentMarks } from "@/components/layout/FooterPaymentMarks";
import { HeaderSocialCircles } from "@/components/layout/HeaderSocialCircles";
import { AppLink } from "@/components/ui/AppLink";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

const NEETRINO_STUDIO_HREF = "https://neetrino.com/"; 
const MARCO_LOGO_SRC = "/logo.webp";
const FOOTER_LINK_CLASS =
  "text-[13px] leading-tight text-marco-slate transition-opacity hover:opacity-80 sm:text-[14px]";
const FOOTER_HEADING_CLASS =
  "text-[13px] font-bold uppercase leading-tight text-marco-slate sm:text-sm";

type SiteFooterProps = {
  dictionary: Dictionary;
  locale: Locale;
};

type FooterNavItem = {
  href: string;
  label: string;
};

function FooterNavColumn({
  title,
  items,
}: {
  title: string;
  items: readonly FooterNavItem[];
}) {
  return (
    <div className="flex w-full flex-col gap-1.5 md:max-[1023px]:items-center md:max-[1023px]:text-center">
      <p className={FOOTER_HEADING_CLASS}>{title}</p>
      <ul className="flex flex-col gap-0.5">
        {items.map((item) => (
          <li key={`${item.href}-${item.label}`}>
            <AppLink
              href={item.href}
              prefetchPolicy="intent"
              className={FOOTER_LINK_CLASS}
            >
              {item.label}
            </AppLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FooterContactsColumn({ dictionary }: { dictionary: Dictionary }) {
  const footer = dictionary.footer;

  return (
    <div className="flex w-full flex-col gap-2 md:max-[1023px]:items-center md:max-[1023px]:text-center">
      <p className={FOOTER_HEADING_CLASS}>{footer.contacts}</p>
      <p className={`flex items-start gap-2 ${FOOTER_LINK_CLASS}`}>
        <MapPin className="mt-0.5 h-[18px] w-[18px] shrink-0" aria-hidden />
        <span>{dictionary.contact.storeAddress}</span>
      </p>
      <div className="flex items-start gap-2">
        <Phone
          className="mt-0.5 h-[18px] w-[18px] shrink-0 text-marco-slate"
          aria-hidden
        />
        <div className="flex flex-col gap-0.5">
          {footer.phones.map((phone) => (
            <a
              key={phone}
              href={`tel:${phone.replace(/\s/g, "")}`}
              className={`${FOOTER_LINK_CLASS} hover:underline`}
            >
              {phone}
            </a>
          ))}
        </div>
      </div>
      <a
        href={`mailto:${dictionary.contact.storeEmail}`}
        className={`flex items-start gap-2 ${FOOTER_LINK_CLASS}`}
      >
        <Mail className="mt-0.5 h-[18px] w-[18px] shrink-0" aria-hidden />
        {dictionary.contact.storeEmail}
      </a>
      <a
        href={`mailto:${footer.secondaryEmail}`}
        className={`flex items-start gap-2 ${FOOTER_LINK_CLASS}`}
      >
        <Mail className="mt-0.5 h-[18px] w-[18px] shrink-0" aria-hidden />
        {footer.secondaryEmail}
      </a>
    </div>
  );
}

function FooterCopyrightStrip({ dictionary }: { dictionary: Dictionary }) {
  const year = new Date().getFullYear();
  const footer = dictionary.footer;

  return (
    <div className="mt-4 flex w-full flex-row items-center justify-between gap-2 border-t border-marco-slate/15 pt-3">
      <HeaderSocialCircles
        instagramHref={dictionary.contact.social.instagram}
        facebookHref={dictionary.contact.social.facebook}
        telegramHref={dictionary.contact.social.telegram}
        ariaLabel={dictionary.header.socialLinks}
        instagramLabel="Instagram"
        facebookLabel="Facebook"
        telegramLabel="Telegram"
      />
      <p className="min-w-0 flex-1 px-2 text-center text-[10px] leading-tight text-marco-slate sm:text-[11px] md:text-xs">
        <span>{footer.copyrightBefore.replace("{year}", String(year))}</span>
        <a
          href={NEETRINO_STUDIO_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-marco-slate no-underline hover:opacity-80"
        >
          {footer.creditStudio}
        </a>
        <span>{footer.copyrightAfter}</span>
      </p>
      <FooterPaymentMarks ariaLabel={footer.paymentMethods} />
    </div>
  );
}

export function SiteFooter({ dictionary, locale }: SiteFooterProps) {
  const footer = dictionary.footer;
  const companyItems: FooterNavItem[] = [
    { href: `/${locale}/products`, label: dictionary.nav.shop },
    { href: `/${locale}/about`, label: dictionary.nav.about },
    { href: `/${locale}/contact`, label: dictionary.nav.contact },
    { href: `/${locale}/blog`, label: dictionary.nav.blog },
  ];
  const supportItems: FooterNavItem[] = [
    { href: `/${locale}/legal/privacy`, label: footer.privacyPolicy },
    { href: `/${locale}/legal/terms`, label: footer.terms },
  ];

  return (
    <footer className="storefront-footer mt-auto shrink-0 border-t border-marco-slate/10 bg-marco-footer pb-24 md:pb-0">
      <div className="mx-auto max-w-7xl px-4 pb-7 pt-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2 lg:grid-cols-[minmax(0,26rem)_1fr] lg:gap-x-5">
          <div className="relative flex max-w-sm flex-col md:max-[1023px]:items-center">
            <div className="relative h-28 w-40 shrink-0 sm:h-36 sm:w-52">
              <Image
                src={MARCO_LOGO_SRC}
                alt={dictionary.brand}
                fill
                className="object-contain object-left-top md:max-[1023px]:object-center"
                sizes="208px"
              />
            </div>
            <p className="mt-3 whitespace-pre-line text-[11px] leading-snug text-marco-slate sm:text-[12px] md:max-[1023px]:text-center">
              {footer.brandDescription}
            </p>
          </div>
          <div className="contents lg:flex lg:w-full lg:items-start lg:justify-between lg:gap-x-8 lg:pt-6">
            <FooterNavColumn title={footer.company} items={companyItems} />
            <FooterNavColumn title={footer.support} items={supportItems} />
            <FooterContactsColumn dictionary={dictionary} />
          </div>
        </div>
        <FooterCopyrightStrip dictionary={dictionary} />
      </div>
    </footer>
  );
}
