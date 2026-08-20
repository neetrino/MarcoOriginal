import { AppLink } from "@/components/ui/AppLink";
import { HOME_SEE_MORE_CLASS } from "@/features/home/ui/home-section-classes";

type HomeSeeMoreCtaProps = {
  href: string;
  label: string;
};

export function HomeSeeMoreCta({ href, label }: HomeSeeMoreCtaProps) {
  return (
    <div className="flex justify-center">
      <AppLink href={href} prefetchPolicy="intent" className={HOME_SEE_MORE_CLASS}>
        {label}
      </AppLink>
    </div>
  );
}
