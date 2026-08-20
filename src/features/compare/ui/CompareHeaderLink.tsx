import { Scale } from "lucide-react";

import { AppLink } from "@/components/ui/AppLink";
import type { Locale } from "@/lib/i18n/config";

type CompareHeaderLinkProps = {
  locale: Locale;
  label: string;
  count: number;
};

export function CompareHeaderLink({
  locale,
  label,
  count,
}: CompareHeaderLinkProps) {
  return (
    <AppLink
      href={`/${locale}/compare`}
      prefetchPolicy="intent"
      aria-label={label}
      className={`relative inline-flex h-10 w-10 items-center justify-center rounded-full text-marco-slate transition-colors duration-200 hover:bg-marco-yellow ${
        count > 0 ? "bg-marco-yellow" : "bg-marco-gray"
      }`}
    >
      <Scale className="h-5 w-5" aria-hidden="true" />
      {count > 0 ? (
        <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-marco-slate px-1 text-[10px] font-semibold text-white">
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </AppLink>
  );
}
