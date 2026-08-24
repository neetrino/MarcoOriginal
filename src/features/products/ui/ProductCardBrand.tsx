import Image from "next/image";

import {
  PRODUCT_CARD_BRAND_LOGO_BOX_CLASS,
  PRODUCT_CARD_BRAND_LOGO_MAX_WIDTH_DESKTOP_PX,
  PRODUCT_CARD_BRAND_LOGO_SLOT_CLASS,
} from "@/features/products/ui/product-card.constants";

type ProductCardBrandProps = {
  logoUrl?: string | null;
  name?: string | null;
};

/** Primary brand wordmark under the price, matching the 3001 product card. */
export function ProductCardBrand({ logoUrl, name }: ProductCardBrandProps) {
  return (
    <div className="min-h-5">
      {logoUrl ? (
        <div className={PRODUCT_CARD_BRAND_LOGO_SLOT_CLASS} aria-label={name ?? undefined}>
          <div className={PRODUCT_CARD_BRAND_LOGO_BOX_CLASS}>
            <Image
              src={logoUrl}
              alt={name ?? ""}
              fill
              sizes={`${PRODUCT_CARD_BRAND_LOGO_MAX_WIDTH_DESKTOP_PX}px`}
              className="object-contain object-left origin-left"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
