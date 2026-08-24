import Image from "next/image";

import {
  FOOTER_PAYMENT_STRIP_HEIGHT_PX,
  FOOTER_PAYMENT_STRIP_SRC,
  FOOTER_PAYMENT_STRIP_WIDTH_PX,
} from "@/components/layout/site-footer.constants";

type FooterPaymentMarksProps = {
  ariaLabel: string;
  compact?: boolean;
};

export function FooterPaymentMarks({
  ariaLabel,
  compact = true,
}: FooterPaymentMarksProps) {
  const containerClass = compact
    ? "flex w-full max-w-32 justify-end sm:max-w-36"
    : "flex w-full max-w-44 justify-end sm:max-w-48";

  const imageClass = compact
    ? "h-auto w-full max-h-4 object-contain object-right opacity-95 sm:max-h-[18px]"
    : "h-auto w-full max-h-5 object-contain object-right opacity-95 sm:max-h-6";

  return (
    <div className={containerClass} aria-label={ariaLabel}>
      <Image
        src={FOOTER_PAYMENT_STRIP_SRC}
        alt=""
        width={FOOTER_PAYMENT_STRIP_WIDTH_PX}
        height={FOOTER_PAYMENT_STRIP_HEIGHT_PX}
        className={imageClass}
        sizes={compact ? "(max-width: 640px) 100vw, 160px" : "(max-width: 640px) 100vw, 192px"}
      />
    </div>
  );
}
