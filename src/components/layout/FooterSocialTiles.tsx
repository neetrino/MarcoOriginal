import Image from "next/image";
import type { ReactNode } from "react";

import { SocialBrandMenu } from "@/components/layout/SocialBrandMenu";
import {
  buildSocialBrandMenus,
  type SocialBrandProfile,
} from "@/components/layout/social-brand-profiles";
import { buildSocialMessengerMenus } from "@/components/layout/social-messenger-contacts";
import {
  FOOTER_SOCIAL_TILE_SPECS,
  type FooterSocialTileSpec,
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

type FooterSocialMenu = {
  menuLabel: string;
  profiles: readonly SocialBrandProfile[];
};

function footerSocialMenu(
  spec: FooterSocialTileSpec,
  brandMenus: ReturnType<typeof buildSocialBrandMenus>,
  messengerMenus: ReturnType<typeof buildSocialMessengerMenus>,
): FooterSocialMenu {
  switch (spec.hrefKey) {
    case "instagram":
      return {
        menuLabel: brandMenus.instagramMenuLabel,
        profiles: brandMenus.instagram,
      };
    case "facebook":
      return {
        menuLabel: brandMenus.facebookMenuLabel,
        profiles: brandMenus.facebook,
      };
    case "telegram":
      return {
        menuLabel: messengerMenus.telegramMenuLabel,
        profiles: messengerMenus.telegram,
      };
    case "whatsapp":
      return {
        menuLabel: messengerMenus.whatsappMenuLabel,
        profiles: messengerMenus.whatsapp,
      };
    case "viber":
      return {
        menuLabel: messengerMenus.viberMenuLabel,
        profiles: messengerMenus.viber,
      };
  }
}

function FooterSocialTile({
  spec,
}: {
  spec: FooterSocialTileSpec;
}): ReactNode {
  if (spec.kind === "viberGlyph") {
    return (
      <Image
        src={spec.src}
        alt=""
        width={16}
        height={16}
        className="h-4 w-4 shrink-0 object-contain"
        aria-hidden
      />
    );
  }

  return (
    <Image
      src={spec.src}
      alt=""
      width={28}
      height={28}
      className={`block ${FOOTER_SOCIAL_TILE_CLASS} max-h-none max-w-none shrink-0`}
      aria-hidden
    />
  );
}

export function FooterSocialTiles({ dictionary }: FooterSocialTilesProps) {
  const brandMenus = buildSocialBrandMenus(dictionary);
  const messengerMenus = buildSocialMessengerMenus(dictionary);

  return (
    <div
      className="flex flex-wrap items-center gap-2"
      role="list"
      aria-label={dictionary.header.socialLinks}
    >
      {FOOTER_SOCIAL_TILE_SPECS.map((spec) => {
        const menu = footerSocialMenu(spec, brandMenus, messengerMenus);
        const surfaceClass =
          spec.kind === "viberGlyph"
            ? FOOTER_SOCIAL_VIBER_SURFACE_CLASS
            : `${FOOTER_SOCIAL_LINK_BASE} ${FOOTER_SOCIAL_TILE_CLASS} overflow-hidden`;

        return (
          <div key={spec.hrefKey} role="listitem">
            <SocialBrandMenu
              label={menu.menuLabel}
              trigger={<FooterSocialTile spec={spec} />}
              triggerClassName={surfaceClass}
              profiles={menu.profiles}
              menuPlacement="top"
            />
          </div>
        );
      })}
    </div>
  );
}
