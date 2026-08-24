import Image from "next/image";
import type { ReactNode } from "react";

import { SocialBrandMenu } from "@/components/layout/SocialBrandMenu";
import { buildSocialBrandMenus } from "@/components/layout/social-brand-profiles";
import {
  FOOTER_SOCIAL_TILE_SPECS,
} from "@/components/layout/site-footer.constants";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

const FOOTER_SOCIAL_LINK_BASE =
  "inline-flex shrink-0 items-center justify-center rounded-full transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marco-slate";

const FOOTER_SOCIAL_TILE_CLASS = "h-7 w-7";
const FOOTER_SOCIAL_VIBER_SURFACE_CLASS =
  `${FOOTER_SOCIAL_LINK_BASE} flex ${FOOTER_SOCIAL_TILE_CLASS} items-center justify-center bg-marco-yellow`;

type FooterSocialTilesProps = {
  dictionary: Dictionary;
};

function socialHref(href: string | undefined): string | null {
  const trimmed = href?.trim() ?? "";
  if (!trimmed || trimmed === "#") {
    return null;
  }
  return trimmed;
}

type SocialLabelKey = "instagram" | "facebook" | "telegram" | "whatsapp" | "viber";

function socialLabel(dictionary: Dictionary, key: SocialLabelKey): string {
  switch (key) {
    case "instagram":
      return "Instagram";
    case "facebook":
      return "Facebook";
    case "telegram":
      return "Telegram";
    case "whatsapp":
      return dictionary.header.whatsapp;
    case "viber":
      return dictionary.header.viber;
  }
}

function FooterSocialLink({
  href,
  label,
  surfaceClass,
  children,
}: {
  href: string | null;
  label: string;
  surfaceClass: string;
  children: ReactNode;
}) {
  if (!href) {
    return (
      <span
        role="listitem"
        className={`${surfaceClass} opacity-50`}
        aria-label={label}
      >
        {children}
      </span>
    );
  }

  return (
    <a
      role="listitem"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={surfaceClass}
      aria-label={label}
    >
      {children}
    </a>
  );
}

export function FooterSocialTiles({ dictionary }: FooterSocialTilesProps) {
  const social = dictionary.contact.social;
  const menus = buildSocialBrandMenus(dictionary);

  return (
    <div
      className="flex flex-wrap items-center gap-2"
      role="list"
      aria-label={dictionary.header.socialLinks}
    >
      {FOOTER_SOCIAL_TILE_SPECS.map((spec) => {
        const label = socialLabel(dictionary, spec.labelKey);

        if (spec.kind === "viberGlyph") {
          return (
            <FooterSocialLink
              key={spec.hrefKey}
              href={socialHref(social.viber)}
              label={label}
              surfaceClass={FOOTER_SOCIAL_VIBER_SURFACE_CLASS}
            >
              <Image
                src={spec.src}
                alt=""
                width={16}
                height={16}
                className="h-4 w-4 shrink-0 object-contain"
                aria-hidden
              />
            </FooterSocialLink>
          );
        }

        const surfaceClass = `${FOOTER_SOCIAL_LINK_BASE} ${FOOTER_SOCIAL_TILE_CLASS} overflow-hidden`;
        const tile = (
          <Image
            src={spec.src}
            alt=""
            width={28}
            height={28}
            className={`block ${FOOTER_SOCIAL_TILE_CLASS} max-h-none max-w-none shrink-0`}
            aria-hidden
          />
        );

        if (spec.hrefKey === "instagram" || spec.hrefKey === "facebook") {
          const profiles =
            spec.hrefKey === "instagram" ? menus.instagram : menus.facebook;
          const menuLabel =
            spec.hrefKey === "instagram"
              ? menus.instagramMenuLabel
              : menus.facebookMenuLabel;

          return (
            <div key={spec.hrefKey} role="listitem">
              <SocialBrandMenu
                label={menuLabel}
                trigger={tile}
                triggerClassName={surfaceClass}
                profiles={profiles}
                menuPlacement="top"
              />
            </div>
          );
        }

        return (
          <FooterSocialLink
            key={spec.hrefKey}
            href={socialHref(social[spec.hrefKey])}
            label={label}
            surfaceClass={surfaceClass}
          >
            {tile}
          </FooterSocialLink>
        );
      })}
    </div>
  );
}
