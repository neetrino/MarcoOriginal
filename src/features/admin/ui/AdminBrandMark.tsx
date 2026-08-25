import Image from "next/image";
import Link from "next/link";

import { getAdminCopy } from "@/features/admin/ui/get-admin-copy";

const MARCO_LOGO_SRC = "/logo.webp";
const MARCO_LOGO_INTRINSIC_WIDTH = 1080;
const MARCO_LOGO_INTRINSIC_HEIGHT = 1350;
const MARCO_LOGO_CROP_CLASS =
  "absolute -left-[48.54%] -top-[75.88%] h-[278.35%] w-[197.08%] max-w-none";

type AdminBrandMarkProps = {
  locale: string;
  onNavigate?: () => void;
};

/**
 * Compact MARCO mark for admin chrome — same crop as the storefront logo.
 */
export function AdminBrandMark({ locale, onNavigate }: AdminBrandMarkProps) {
  const nav = getAdminCopy(locale).nav;

  return (
    <Link
      href={`/${locale}`}
      onClick={onNavigate}
      className="flex shrink-0 items-center gap-2 rounded-xl px-1.5 py-1 hover:bg-white"
      title={nav.brandTitle}
      aria-label={nav.brandTitle}
    >
      <span className="relative aspect-[83/73] h-11 w-auto overflow-hidden">
        <Image
          src={MARCO_LOGO_SRC}
          alt=""
          width={MARCO_LOGO_INTRINSIC_WIDTH}
          height={MARCO_LOGO_INTRINSIC_HEIGHT}
          className={MARCO_LOGO_CROP_CLASS}
          quality={75}
        />
      </span>
      <span className="min-w-0 truncate text-sm font-semibold text-marco-ink">
        {nav.adminMark}
      </span>
    </Link>
  );
}
