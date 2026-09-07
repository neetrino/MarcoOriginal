"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";

import {
  MOBILE_BROWSE_SEARCH_FORM_CLASS,
  MOBILE_BROWSE_SEARCH_INPUT_CLASS,
  MOBILE_BROWSE_SEARCH_SUBMIT_CLASS,
} from "@/features/categories/ui/mobile-catalog-browse.classes";
import { catalogHref } from "@/features/products/domain/catalog-href";
import { EMPTY_CATALOG_SEARCH } from "@/features/products/domain/catalog-search-params";
import {
  CATALOG_SEARCH_QUERY_MAX_LENGTH,
  normalizeCatalogSearchQuery,
} from "@/features/products/domain/catalog-text-search";
import type { Locale } from "@/lib/i18n/config";

type MobileCatalogBrowseSearchProps = {
  locale: Locale;
  placeholder: string;
  submitLabel: string;
  onSubmitNavigate?: () => void;
};

export function MobileCatalogBrowseSearch({
  locale,
  placeholder,
  submitLabel,
  onSubmitNavigate,
}: MobileCatalogBrowseSearchProps) {
  const router = useRouter();

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const q = normalizeCatalogSearchQuery(String(formData.get("q") ?? ""));
    const href = catalogHref(locale, {
      ...EMPTY_CATALOG_SEARCH,
      q,
    });
    onSubmitNavigate?.();
    router.push(href);
  }

  return (
    <form
      action={catalogHref(locale, EMPTY_CATALOG_SEARCH)}
      method="get"
      className={MOBILE_BROWSE_SEARCH_FORM_CLASS}
      onSubmit={handleSubmit}
    >
      <span className="relative mr-2 size-6 shrink-0 overflow-hidden" aria-hidden>
        <Image
          src="/assets/mobile-catalog/icon-search.svg"
          alt=""
          width={24}
          height={24}
          className="size-full"
          unoptimized
        />
      </span>
      <input
        type="search"
        name="q"
        placeholder={placeholder}
        aria-label={placeholder}
        autoComplete="off"
        maxLength={CATALOG_SEARCH_QUERY_MAX_LENGTH}
        className={MOBILE_BROWSE_SEARCH_INPUT_CLASS}
      />
      <button type="submit" className={MOBILE_BROWSE_SEARCH_SUBMIT_CLASS}>
        {submitLabel}
      </button>
    </form>
  );
}
