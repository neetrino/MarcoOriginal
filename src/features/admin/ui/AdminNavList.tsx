"use client";

import { Fragment } from "react";
import Link from "next/link";

import {
  getAdminMenuItems,
  isAdminTabActive,
  type AdminMenuItem,
} from "@/features/admin/ui/admin-menu.config";
import { getAdminCopy } from "@/features/admin/ui/get-admin-copy";
import {
  adminNavGroupClass,
  adminNavGroupLinkClass,
  adminNavGroupToggleClass,
  adminNavIconClass,
  adminNavItemClass,
  adminNavSeparatorClass,
} from "@/features/admin/ui/admin-nav-classes";
import { useAdminProductsSubnavExpanded } from "@/features/admin/ui/useAdminProductsSubnavExpanded";

type AdminNavListProps = {
  locale: string;
  pathname: string;
  onNavigate?: () => void;
};

function isNestedVisible(
  tab: AdminMenuItem,
  pathname: string,
  locale: string,
  productsNestedExpanded: boolean,
): boolean {
  if (tab.parentGroupId !== "products") return true;
  if (isAdminTabActive(tab.href, pathname, locale)) return true;
  return productsNestedExpanded;
}

export function AdminNavList({
  locale,
  pathname,
  onNavigate,
}: AdminNavListProps) {
  const tabs = getAdminMenuItems(locale);
  const nav = getAdminCopy(locale).nav;
  const [productsNestedExpanded, toggleProductsNested] =
    useAdminProductsSubnavExpanded(pathname, locale);

  return (
    <>
      {tabs.map((tab) => {
        if (
          !isNestedVisible(tab, pathname, locale, productsNestedExpanded)
        ) {
          return null;
        }

        const isActive = isAdminTabActive(tab.href, pathname, locale);
        const row =
          tab.id === "products" ? (
            <div className={adminNavGroupClass(isActive)}>
              <Link
                href={tab.href}
                title={tab.label}
                onClick={onNavigate}
                className={adminNavGroupLinkClass(isActive)}
              >
                <span className={adminNavIconClass(isActive)}>{tab.icon}</span>
                <span className="min-w-0 truncate">{tab.label}</span>
              </Link>
              <button
                type="button"
                aria-expanded={productsNestedExpanded}
                aria-label={nav.toggleProductSubpages}
                title={nav.toggleProductSubpages}
                onClick={(event) => {
                  event.preventDefault();
                  toggleProductsNested();
                }}
                className={adminNavGroupToggleClass(isActive)}
              >
                <svg
                  className={`h-5 w-5 transition-transform ${productsNestedExpanded ? "" : "-rotate-90"}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>
          ) : (
            <Link
              href={tab.href}
              title={tab.label}
              onClick={onNavigate}
              className={adminNavItemClass({
                active: isActive,
                isSubCategory: tab.isSubCategory,
              })}
            >
              <span className={adminNavIconClass(isActive)}>{tab.icon}</span>
              <span className="min-w-0 truncate">{tab.label}</span>
            </Link>
          );

        return (
          <Fragment key={tab.id}>
            {row}
            {tab.separatorAfter ? (
              <div className={adminNavSeparatorClass} aria-hidden />
            ) : null}
          </Fragment>
        );
      })}
    </>
  );
}
