"use client";

import { IconDropdown } from "@/components/ui/IconDropdown";
import type { SocialBrandProfile } from "@/components/layout/social-brand-profiles";

const MENU_SURFACE_CLASS =
  "w-max overflow-hidden rounded-xl border border-gray-200/90 bg-white py-1 shadow-xl";

const MENU_ITEM_CLASS =
  "block w-full whitespace-nowrap px-4 py-2 text-left text-[13px] font-medium text-marco-slate hover:bg-marco-gray/80";

type SocialBrandMenuProps = {
  label: string;
  trigger: React.ReactNode;
  triggerClassName: string;
  profiles: readonly SocialBrandProfile[];
  menuPlacement?: "bottom" | "top";
};

export function SocialBrandMenu({
  label,
  trigger,
  triggerClassName,
  profiles,
  menuPlacement = "bottom",
}: SocialBrandMenuProps) {
  return (
    <IconDropdown
      label={label}
      trigger={trigger}
      triggerClassName={`${triggerClassName} cursor-pointer p-0`}
      menuPlacement={menuPlacement}
      menuAlign="left"
      menuSurfaceClass={MENU_SURFACE_CLASS}
      className="shrink-0"
    >
      {profiles.map((profile) => (
        <a
          key={profile.href}
          role="menuitem"
          href={profile.href}
          target="_blank"
          rel="noopener noreferrer"
          className={MENU_ITEM_CLASS}
        >
          {profile.label}
        </a>
      ))}
    </IconDropdown>
  );
}
