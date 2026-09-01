"use client";

import { useSearchParams } from "next/navigation";

import { CATALOG_SEARCH_QUERY_MAX_LENGTH } from "@/features/products/domain/catalog-text-search";

type HeaderSearchQueryInputProps = {
  placeholder: string;
};

/** Reads current `q` from the URL so submitting filters keeps the typed query visible. */
export function HeaderSearchQueryInput({
  placeholder,
}: HeaderSearchQueryInputProps) {
  const searchParams = useSearchParams();
  const defaultValue = searchParams.get("q") ?? "";

  return (
    <input
      type="search"
      name="q"
      defaultValue={defaultValue}
      placeholder={placeholder}
      className="min-w-0 flex-1 bg-transparent px-2 text-xs text-marco-slate outline-none placeholder:text-marco-slate/60"
      aria-label={placeholder}
      autoComplete="off"
      maxLength={CATALOG_SEARCH_QUERY_MAX_LENGTH}
    />
  );
}
