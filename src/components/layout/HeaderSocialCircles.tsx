import {
  FacebookIcon,
  InstagramIcon,
  TelegramIcon,
} from "@/components/layout/SocialIcons";
import { HEADER_SOCIAL_CIRCLE_CLASS } from "@/components/layout/site-header-classes";

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
  ariaLabel: string;
  instagramLabel: string;
  facebookLabel: string;
  telegramLabel: string;
  className?: string;
};

function socialHref(href: string): string | null {
  const trimmed = href.trim();
  if (!trimmed || trimmed === "#") {
    return null;
  }
  return trimmed;
}

export function HeaderSocialCircles({
  instagramHref,
  facebookHref,
  telegramHref,
  ariaLabel,
  instagramLabel,
  facebookLabel,
  telegramLabel,
  className = "",
}: HeaderSocialCirclesProps) {
  const links: SocialLink[] = [
    { href: instagramHref, label: instagramLabel, Icon: InstagramIcon },
    { href: facebookHref, label: facebookLabel, Icon: FacebookIcon },
    { href: telegramHref, label: telegramLabel, Icon: TelegramIcon },
  ];

  return (
    <div
      className={`flex shrink-0 items-center gap-4 ${className}`}
      role="list"
      aria-label={ariaLabel}
    >
      {links.map((link) => {
        const href = socialHref(link.href);
        const { Icon } = link;
        const inner = <Icon className="h-4 w-4" />;

        if (!href) {
          return (
            <span
              key={link.label}
              role="listitem"
              className={`${HEADER_SOCIAL_CIRCLE_CLASS} opacity-40`}
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
            className={HEADER_SOCIAL_CIRCLE_CLASS}
            aria-label={link.label}
          >
            {inner}
          </a>
        );
      })}
    </div>
  );
}
