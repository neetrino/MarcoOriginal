import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

import { AppLink } from "@/components/ui/AppLink";
import { catalogPaginationSlots } from "@/features/products/domain/catalog-pagination-slots";
import {
  catalogHref,
  withCatalogPage,
} from "@/features/products/domain/catalog-href";
import type { CatalogSearchParams } from "@/features/products/domain/catalog-search-params";

const CONTROL_BASE =
  "inline-flex h-9 min-w-0 shrink-0 items-center justify-center gap-1 rounded-[9px] border border-[#e2e2e2] px-3 py-2 text-sm leading-5 text-[#313131] transition-colors";
const CONTROL_WHITE = `${CONTROL_BASE} bg-white hover:bg-[#fafafa]`;
const CONTROL_GREY = `${CONTROL_BASE} min-w-[105px] bg-marco-card hover:bg-[#efefef]`;
const PAGE_BASE =
  "inline-flex min-h-9 min-w-[2rem] shrink-0 items-center justify-center rounded-[9px] border border-[#e2e2e2] px-3 py-2 text-sm leading-5";
const ICON = "h-4 w-4 shrink-0";

type CatalogPaginationCopy = {
  paginationLabel: string;
  previousPage: string;
  nextPage: string;
  firstPage: string;
  lastPage: string;
};

type CatalogPaginationProps = {
  locale: string;
  filters: CatalogSearchParams;
  page: number;
  totalPages: number;
  copy: CatalogPaginationCopy;
};

export function CatalogPagination({
  locale,
  filters,
  page,
  totalPages,
  copy,
}: CatalogPaginationProps) {
  if (totalPages <= 1) return null;

  const hrefFor = (nextPage: number): string =>
    catalogHref(locale, withCatalogPage(filters, nextPage));

  return (
    <nav
      aria-label={copy.paginationLabel}
      className="mt-14 flex flex-wrap items-center justify-center gap-2 md:mt-24"
    >
      <PaginationControl
        href={page > 1 ? hrefFor(1) : null}
        className={CONTROL_GREY}
        label={copy.firstPage}
      >
        <ChevronsLeft className={ICON} />
        {copy.firstPage}
      </PaginationControl>
      <PaginationControl
        href={page > 1 ? hrefFor(page - 1) : null}
        className={CONTROL_WHITE}
        label={copy.previousPage}
      >
        <ChevronLeft className={ICON} />
        {copy.previousPage}
      </PaginationControl>
      {catalogPaginationSlots(totalPages, page).map((slot, index) =>
        slot === "ellipsis" ? (
          <span
            key={`ellipsis-${index}`}
            className={`${PAGE_BASE} min-w-[31px] bg-white text-[#313131]`}
            aria-hidden
          >
            …
          </span>
        ) : slot === page ? (
          <span
            key={slot}
            className={`${PAGE_BASE} border-[#383838] bg-white font-bold text-[#383838]`}
            aria-current="page"
          >
            {slot}
          </span>
        ) : (
          <AppLink
            key={slot}
            href={hrefFor(slot)}
            prefetchPolicy="intent"
            className={`${PAGE_BASE} bg-white text-[#313131] hover:bg-[#fafafa]`}
          >
            {slot}
          </AppLink>
        ),
      )}
      <PaginationControl
        href={page < totalPages ? hrefFor(page + 1) : null}
        className={CONTROL_WHITE}
        label={copy.nextPage}
      >
        {copy.nextPage}
        <ChevronRight className={ICON} />
      </PaginationControl>
      <PaginationControl
        href={page < totalPages ? hrefFor(totalPages) : null}
        className={CONTROL_GREY}
        label={copy.lastPage}
      >
        {copy.lastPage}
        <ChevronsRight className={ICON} />
      </PaginationControl>
    </nav>
  );
}

function PaginationControl({
  href,
  className,
  label,
  children,
}: {
  href: string | null;
  className: string;
  label: string;
  children: ReactNode;
}) {
  if (!href) {
    return (
      <span className={`${className} cursor-not-allowed opacity-45`} aria-disabled="true">
        {children}
      </span>
    );
  }

  return (
    <AppLink href={href} prefetchPolicy="intent" className={className} aria-label={label}>
      {children}
    </AppLink>
  );
}
