import type { Locale } from "@/lib/i18n/config";
import type { Currency } from "@/lib/money/currency";
import { toIdramAmountString } from "@/lib/payments/idram/amounts";
import { getIdramConfig } from "@/lib/payments/idram/config";

const IDRAM_LANGUAGE: Record<Locale, string> = {
  en: "EN",
  hy: "AM",
  ru: "RU",
};

export type IdramFormBuildInput = {
  orderNumber: string;
  amountMinor: number;
  currency: Currency;
  description: string;
  locale: Locale;
  email?: string;
};

/** Builds hidden fields for POST to Idram GetPayment. */
export function buildIdramPaymentForm(input: IdramFormBuildInput): {
  action: string;
  fields: Record<string, string>;
} {
  if (input.currency !== "AMD") {
    throw new Error("Idram supports AMD only");
  }

  const config = getIdramConfig();
  const fields: Record<string, string> = {
    EDP_LANGUAGE: IDRAM_LANGUAGE[input.locale],
    EDP_REC_ACCOUNT: config.recAccount,
    EDP_DESCRIPTION: input.description.slice(0, 512),
    EDP_AMOUNT: toIdramAmountString(input.amountMinor, input.currency),
    EDP_BILL_NO: input.orderNumber,
    order_number: input.orderNumber,
  };

  if (input.email) {
    fields.EDP_EMAIL = input.email;
  }

  return {
    action: config.getPaymentUrl,
    fields,
  };
}
