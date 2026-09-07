"use client";

import Image from "next/image";

import { CATALOG_SEARCH_QUERY_MAX_LENGTH } from "@/features/products/domain/catalog-text-search";
import {
  MOBILE_BROWSE_SEARCH_FORM_CLASS,
  MOBILE_BROWSE_SEARCH_INPUT_CLASS,
  MOBILE_BROWSE_SEARCH_SUBMIT_CLASS,
} from "@/features/categories/ui/mobile-catalog-browse.classes";

type MobileCatalogBrowseSearchProps = {
  action: string;
  placeholder: string;
  submitLabel: string;
  onSubmitNavigate?: () => void;
};

export function MobileCatalogBrowseSearch({
  action,
  placeholder,
  submitLabel,
  onSubmitNavigate,
}: MobileCatalogBrowseSearchProps) {
  return (
    <form
      action={action}
      method="get"
      className={MOBILE_BROWSE_SEARCH_FORM_CLASS}
      onSubmit={() => {
        onSubmitNavigate?.();
      }}
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
