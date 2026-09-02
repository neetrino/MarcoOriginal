import {
  FacebookIcon,
  InstagramIcon,
  TelegramIcon,
  ViberIcon,
  WhatsAppIcon,
} from "@/components/layout/SocialIcons";
import { SocialBrandMenu } from "@/components/layout/SocialBrandMenu";
import {
  buildSocialBrandMenus,
  type SocialBrandProfile,
} from "@/components/layout/social-brand-profiles";
import { buildSocialMessengerMenus } from "@/components/layout/social-messenger-contacts";
import {
  FOOTER_SOCIAL_CIRCLE_SIZE_CLASS,
  HEADER_SOCIAL_CIRCLE_CLASS,
  HEADER_SOCIAL_CIRCLE_SIZE_CLASS,
} from "@/components/layout/site-header-classes";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

type SocialIcon = typeof InstagramIcon;

type BrandSocialLink = {
  kind: "menu";
  label: string;
  menuLabel: string;
  profiles: readonly SocialBrandProfile[];
  Icon: SocialIcon;
};

type HeaderSocialCirclesProps = {
  dictionary: Dictionary;
  className?: string;
  variant?: "header" | "compact";
  menuPlacement?: "bottom" | "top";
};

function buildSocialItems(dictionary: Dictionary): BrandSocialLink[] {
  const brandMenus = buildSocialBrandMenus(dictionary);
  const messengerMenus = buildSocialMessengerMenus(dictionary);

  return [
    {
      kind: "menu",
      label: "Instagram",
      menuLabel: brandMenus.instagramMenuLabel,
      profiles: brandMenus.instagram,
      Icon: InstagramIcon,
    },
    {
      kind: "menu",
      label: "Facebook",
      menuLabel: brandMenus.facebookMenuLabel,
      profiles: brandMenus.facebook,
      Icon: FacebookIcon,
    },
    {
      kind: "menu",
      label: "Telegram",
      menuLabel: messengerMenus.telegramMenuLabel,
      profiles: messengerMenus.telegram,
      Icon: TelegramIcon,
    },
    {
      kind: "menu",
      label: dictionary.header.whatsapp,
      menuLabel: messengerMenus.whatsappMenuLabel,
      profiles: messengerMenus.whatsapp,
      Icon: WhatsAppIcon,
    },
    {
      kind: "menu",
      label: dictionary.header.viber,
      menuLabel: messengerMenus.viberMenuLabel,
      profiles: messengerMenus.viber,
      Icon: ViberIcon,
    },
  ];
}

function SocialCircleItem({
  item,
  iconClass,
  surfaceClass,
  menuPlacement,
}: {
  item: BrandSocialLink;
  iconClass: string;
  surfaceClass: string;
  menuPlacement: "bottom" | "top";
}) {
  const { Icon } = item;

  return (
    <div role="listitem">
      <SocialBrandMenu
        label={item.menuLabel}
        trigger={<Icon className={iconClass} />}
        triggerClassName={surfaceClass}
        profiles={item.profiles}
        menuPlacement={menuPlacement}
      />
    </div>
  );
}

export function HeaderSocialCircles({
  dictionary,
  className = "",
  variant = "compact",
  menuPlacement = "bottom",
}: HeaderSocialCirclesProps) {
  const items = buildSocialItems(dictionary);
  const sizeClass =
    variant === "header"
      ? HEADER_SOCIAL_CIRCLE_SIZE_CLASS
      : FOOTER_SOCIAL_CIRCLE_SIZE_CLASS;
  const gapClass = variant === "header" ? "gap-6 min-[1367px]:gap-4" : "gap-4";
  const iconClass =
    variant === "header"
      ? "h-5 w-5 min-[1367px]:h-3.5 min-[1367px]:w-3.5"
      : "h-4 w-4";
  const surfaceClass = `${HEADER_SOCIAL_CIRCLE_CLASS} ${sizeClass}`;

  return (
    <div
      className={`flex shrink-0 items-center ${gapClass} ${className}`}
      role="list"
      aria-label={dictionary.header.socialLinks}
    >
      {items.map((item) => (
        <SocialCircleItem
          key={item.label}
          item={item}
          iconClass={iconClass}
          surfaceClass={surfaceClass}
          menuPlacement={menuPlacement}
        />
      ))}
    </div>
  );
}
