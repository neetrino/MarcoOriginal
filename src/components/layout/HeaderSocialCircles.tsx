import {
  FacebookIcon,
  InstagramIcon,
  TelegramIcon,
  ViberIcon,
  WhatsAppIcon,
} from "@/components/layout/SocialIcons";
import {
  FOOTER_SOCIAL_CIRCLE_SIZE_CLASS,
  HEADER_SOCIAL_CIRCLE_CLASS,
  HEADER_SOCIAL_CIRCLE_SIZE_CLASS,
} from "@/components/layout/site-header-classes";

type SocialIcon = typeof InstagramIcon;

type SocialLink = {
  href: string;
  label: string;
  Icon: SocialIcon;
};

type HeaderSocialCirclesProps = {
  instagramHref: string;
  facebookHref: string;
  telegramHref: string;
  whatsappHref?: string;
  viberHref?: string;
  ariaLabel: string;
  instagramLabel: string;
  facebookLabel: string;
  telegramLabel: string;
  whatsappLabel?: string;
  viberLabel?: string;
  className?: string;
  variant?: "header" | "compact";
};

function socialHref(href: string | undefined): string | null {
  const trimmed = href?.trim() ?? "";
  if (!trimmed || trimmed === "#") {
    return null;
  }
  return trimmed;
}

function buildSocialLinks(props: HeaderSocialCirclesProps): SocialLink[] {
  const links: SocialLink[] = [
    { href: props.instagramHref, label: props.instagramLabel, Icon: InstagramIcon },
    { href: props.facebookHref, label: props.facebookLabel, Icon: FacebookIcon },
    { href: props.telegramHref, label: props.telegramLabel, Icon: TelegramIcon },
  ];

  if (props.whatsappHref && props.whatsappLabel) {
    links.push({
      href: props.whatsappHref,
      label: props.whatsappLabel,
      Icon: WhatsAppIcon,
    });
  }

  if (props.viberHref && props.viberLabel) {
    links.push({
      href: props.viberHref,
      label: props.viberLabel,
      Icon: ViberIcon,
    });
  }

  return links;
}

export function HeaderSocialCircles({
  className = "",
  variant = "compact",
  ...props
}: HeaderSocialCirclesProps) {
  const links = buildSocialLinks(props);
  const sizeClass =
    variant === "header"
      ? HEADER_SOCIAL_CIRCLE_SIZE_CLASS
      : FOOTER_SOCIAL_CIRCLE_SIZE_CLASS;
  const gapClass = variant === "header" ? "gap-6 min-[1367px]:gap-4" : "gap-4";
  const iconClass =
    variant === "header"
      ? "h-5 w-5 min-[1367px]:h-3.5 min-[1367px]:w-3.5"
      : "h-4 w-4";

  return (
    <div
      className={`flex shrink-0 items-center ${gapClass} ${className}`}
      role="list"
      aria-label={props.ariaLabel}
    >
      {links.map((link) => {
        const href = socialHref(link.href);
        const { Icon } = link;
        const inner = <Icon className={iconClass} />;
        const surfaceClass = `${HEADER_SOCIAL_CIRCLE_CLASS} ${sizeClass}`;

        if (!href) {
          return (
            <span
              key={link.label}
              role="listitem"
              className={`${surfaceClass} opacity-40`}
              aria-label={link.label}
            >
              {inner}
            </span>
          );
        }

        return (
          <a
            key={link.label}
            role="listitem"
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={surfaceClass}
            aria-label={link.label}
          >
            {inner}
          </a>
        );
      })}
    </div>
  );
}
