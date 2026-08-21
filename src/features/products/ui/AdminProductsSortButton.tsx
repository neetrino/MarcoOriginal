import Link from "next/link";

import type { AdminProductsSortField } from "@/features/products/domain/admin-products-query";
import { ADMIN_PRODUCTS_SORT_BUTTON } from "@/features/products/ui/admin-products.classes";

type AdminProductsSortButtonProps = {
  href: string;
  label: string;
  suffix?: string;
  field: AdminProductsSortField;
  activeSort: string;
  activeDir: string;
};

function SortChevron({
  active,
  direction,
}: {
  active: boolean;
  direction: "asc" | "desc";
}) {
  const path =
    direction === "asc" ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7";
  return (
    <svg
      className={`h-2.5 w-2.5 ${active ? "text-marco-ink" : "text-gray-400"}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d={path}
      />
    </svg>
  );
}

export function AdminProductsSortButton({
  href,
  label,
  suffix,
  field,
  activeSort,
  activeDir,
}: AdminProductsSortButtonProps) {
  return (
    <Link href={href} className={ADMIN_PRODUCTS_SORT_BUTTON}>
      <span>{label}</span>
      {suffix ? (
        <span className="normal-case tabular-nums text-gray-400">{suffix}</span>
      ) : null}
      <span className="flex flex-col gap-0.5">
        <SortChevron active={activeSort === field && activeDir === "asc"} direction="asc" />
        <SortChevron
          active={activeSort === field && activeDir === "desc"}
          direction="desc"
        />
      </span>
    </Link>
  );
}
