import { Search } from "lucide-react";

import {
  HEADER_CATEGORIES_PILL_CLASS,
  HEADER_SEARCH_SUBMIT_CLASS,
} from "@/components/layout/site-header-classes";
import { AppLink } from "@/components/ui/AppLink";
import type { Locale } from "@/lib/i18n/config";

type HeaderSearchBarProps = {
  locale: Locale;
  categoriesLabel: string;
  placeholder: string;
  submitLabel: string;
};

export function HeaderSearchBar({
  locale,
  categoriesLabel,
  placeholder,
  submitLabel,
}: HeaderSearchBarProps) {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-x-[22px]">
      <AppLink
        href={`/${locale}/products`}
        prefetchPolicy="intent"
        className={HEADER_CATEGORIES_PILL_CLASS}
      >
        {categoriesLabel}
      </AppLink>

      <form
        action={`/${locale}/products`}
        method="get"
        className="flex h-10 min-w-0 flex-1 items-center rounded-[89px] bg-marco-gray pr-0 pl-4"
      >
        <Search
          className="h-4 w-4 shrink-0 text-marco-slate"
          aria-hidden
        />
        <input
          type="search"
          name="q"
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent px-2 text-xs text-marco-slate outline-none placeholder:text-marco-slate/60"
          aria-label={placeholder}
        />
        <button type="submit" className={HEADER_SEARCH_SUBMIT_CLASS}>
          {submitLabel}
        </button>
      </form>
    </div>
  );
}
