import { CompareIcon } from "@/features/compare/ui/CompareIcon";
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
      className={`relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-transparent text-marco-slate transition-[background-color,color] duration-200 hover:bg-marco-yellow ${
        count > 0 ? "bg-marco-yellow" : "bg-marco-gray"
      }`}
    >
      <CompareIcon size={18} className="h-[18px] w-[18px] shrink-0" />
      {count > 0 ? (
        <span className="absolute -top-[13px] -right-[13px] flex h-4 min-w-[18px] items-center justify-center rounded-full bg-red-600 px-0.5 text-[9px] font-bold leading-none text-white">
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </AppLink>
  );
}
