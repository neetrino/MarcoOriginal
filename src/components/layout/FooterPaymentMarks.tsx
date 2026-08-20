import Image from "next/image";

type FooterPaymentMarksProps = {
  ariaLabel: string;
};

const PAYMENT_MARKS = [
  {
    src: "/assets/payments/checkout/visa.webp",
    alt: "Visa",
    width: 48,
    height: 16,
  },
  {
    src: "/assets/payments/checkout/mastercard.webp",
    alt: "Mastercard",
    width: 32,
    height: 20,
  },
  {
    src: "/assets/payments/checkout/arca.webp",
    alt: "ArCa",
    width: 28,
    height: 20,
  },
  {
    src: "/assets/payments/idram.webp",
    alt: "Idram",
    width: 48,
    height: 16,
  },
] as const;

export function FooterPaymentMarks({ ariaLabel }: FooterPaymentMarksProps) {
  return (
    <div className="flex shrink-0 items-center gap-2" aria-label={ariaLabel}>
      {PAYMENT_MARKS.map((mark) => (
        <Image
          key={mark.alt}
          src={mark.src}
          alt={mark.alt}
          width={mark.width}
          height={mark.height}
          className="h-4 w-auto object-contain opacity-90 sm:h-[18px]"
        />
      ))}
    </div>
  );
}
