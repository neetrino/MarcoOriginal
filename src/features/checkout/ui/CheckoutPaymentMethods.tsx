"use client";

import { useState } from "react";
import Image from "next/image";

import type { CheckoutPaymentMethod } from "@/features/checkout/domain/payment-methods";
import {
  CARD_BRAND_LOGOS,
  IDRAM_LOGO_SRC,
} from "@/features/checkout/ui/checkout-payment-assets";
import {
  CHECKOUT_PAYMENT_LOGO_CELL_CLASS,
  CHECKOUT_PAYMENT_OPTION_BASE_CLASS,
  CHECKOUT_PAYMENT_OPTION_IDLE_CLASS,
  CHECKOUT_PAYMENT_OPTION_SELECTED_CLASS,
  CHECKOUT_PAYMENT_SECTION_CLASS,
} from "@/features/checkout/ui/checkout-section-classes";

type PaymentOption = {
  id: CheckoutPaymentMethod;
  name: string;
  description: string;
};

type CheckoutPaymentMethodsProps = {
  title: string;
  options: PaymentOption[];
  value: CheckoutPaymentMethod;
  onChange: (method: CheckoutPaymentMethod) => void;
  disabled: boolean;
};

function CashPaymentIcon() {
  return (
    <svg
      className="h-9 w-9 text-emerald-600"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect x="2.5" y="6" width="19" height="12" rx="2" fill="currentColor" opacity={0.15} />
      <rect
        x="3"
        y="6.5"
        width="18"
        height="11"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.25"
        fill="none"
      />
      <circle cx="12" cy="12" r="2.25" fill="currentColor" opacity={0.35} />
      <path
        d="M6 9.5h2M6 14.5h2M16 9.5h2M16 14.5h2"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        opacity={0.45}
      />
    </svg>
  );
}

function PaymentOptionGraphic({
  option,
  logoError,
  onLogoError,
}: {
  option: PaymentOption;
  logoError: boolean;
  onLogoError: () => void;
}) {
  if (option.id === "cash_on_delivery") {
    return (
      <div className={CHECKOUT_PAYMENT_LOGO_CELL_CLASS}>
        <CashPaymentIcon />
      </div>
    );
  }

  if (option.id === "idram") {
    return (
      <div className={CHECKOUT_PAYMENT_LOGO_CELL_CLASS}>
        {logoError ? (
          <span className="text-xs font-semibold text-gray-500">Idram</span>
        ) : (
          <Image
            src={IDRAM_LOGO_SRC}
            alt={option.name}
            width={52}
            height={40}
            className="max-h-10 max-w-[3.25rem] object-contain p-1"
            onError={onLogoError}
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex shrink-0 items-center gap-2">
      {CARD_BRAND_LOGOS.map((badge) => (
        <div key={badge.alt} className={CHECKOUT_PAYMENT_LOGO_CELL_CLASS}>
          <Image
            src={badge.src}
            alt=""
            width={40}
            height={36}
            className="max-h-9 max-w-[2.5rem] object-contain p-1"
          />
        </div>
      ))}
    </div>
  );
}

export function CheckoutPaymentMethods({
  title,
  options,
  value,
  onChange,
  disabled,
}: CheckoutPaymentMethodsProps) {
  const [idramLogoError, setIdramLogoError] = useState(false);

  return (
    <section className={CHECKOUT_PAYMENT_SECTION_CLASS}>
      <h2 className="mb-5 text-lg font-semibold text-marco-slate">{title}</h2>
      <div className="space-y-4">
        {options.map((option) => {
          const selected = value === option.id;

          return (
            <label
              key={option.id}
              className={`${CHECKOUT_PAYMENT_OPTION_BASE_CLASS} ${
                selected
                  ? CHECKOUT_PAYMENT_OPTION_SELECTED_CLASS
                  : CHECKOUT_PAYMENT_OPTION_IDLE_CLASS
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={option.id}
                checked={selected}
                disabled={disabled}
                onChange={() => onChange(option.id)}
                className="sr-only"
              />
              <PaymentOptionGraphic
                option={option}
                logoError={idramLogoError}
                onLogoError={() => setIdramLogoError(true)}
              />
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-marco-ink">{option.name}</div>
                <div className="hidden text-sm text-gray-500 sm:block">
                  {option.description}
                </div>
              </div>
            </label>
          );
        })}
      </div>
    </section>
  );
}
