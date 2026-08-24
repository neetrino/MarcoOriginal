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
import {
  FOOTER_SOCIAL_CIRCLE_SIZE_CLASS,
  HEADER_SOCIAL_CIRCLE_CLASS,
  HEADER_SOCIAL_CIRCLE_SIZE_CLASS,
} from "@/components/layout/site-header-classes";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

type SocialIcon = typeof InstagramIcon;

type DirectSocialLink = {
  kind: "link";
  href: string;
  label: string;
  Icon: SocialIcon;
};

type BrandSocialLink = {
  kind: "brands";
  label: string;
  menuLabel: string;
  profiles: readonly SocialBrandProfile[];
  Icon: SocialIcon;
};

type SocialItem = DirectSocialLink | BrandSocialLink;

type HeaderSocialCirclesProps = {
  dictionary: Dictionary;
  className?: string;
  variant?: "header" | "compact";
  menuPlacement?: "bottom" | "top";
};

function socialHref(href: string | undefined): string | null {
  const trimmed = href?.trim() ?? "";
  if (!trimmed || trimmed === "#") {
    return null;
  }
  return trimmed;
}

function buildSocialItems(dictionary: Dictionary): SocialItem[] {
  const menus = buildSocialBrandMenus(dictionary);
  const social = dictionary.contact.social;
  const items: SocialItem[] = [
    {
      kind: "brands",
      label: "Instagram",
      menuLabel: menus.instagramMenuLabel,
      profiles: menus.instagram,
      Icon: InstagramIcon,
    },
    {
      kind: "brands",
      label: "Facebook",
      menuLabel: menus.facebookMenuLabel,
      profiles: menus.facebook,
      Icon: FacebookIcon,
    },
    { kind: "link", href: social.telegram, label: "Telegram", Icon: TelegramIcon },
  ];

  if (social.whatsapp) {
    items.push({
      kind: "link",
      href: social.whatsapp,
      label: dictionary.header.whatsapp,
      Icon: WhatsAppIcon,
    });
  }

  if (social.viber) {
    items.push({
      kind: "link",
      href: social.viber,
      label: dictionary.header.viber,
      Icon: ViberIcon,
    });
  }

  return items;
}

function SocialCircleItem({
  item,
  iconClass,
  surfaceClass,
  menuPlacement,
}: {
  item: SocialItem;
  iconClass: string;
  surfaceClass: string;
  menuPlacement: "bottom" | "top";
}) {
  const { Icon } = item;
  const inner = <Icon className={iconClass} />;

  if (item.kind === "brands") {
    return (
      <div role="listitem">
        <SocialBrandMenu
          label={item.menuLabel}
          trigger={inner}
          triggerClassName={surfaceClass}
          profiles={item.profiles}
          menuPlacement={menuPlacement}
        />
      </div>
    );
  }

  const href = socialHref(item.href);
  if (!href) {
    return (
      <span
        role="listitem"
        className={`${surfaceClass} opacity-40`}
        aria-label={item.label}
      >
        {inner}
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
      aria-label={item.label}
    >
      {inner}
    </a>
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
