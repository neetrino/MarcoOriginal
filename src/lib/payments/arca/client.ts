import "server-only";

import { logger } from "@/lib/observability/logger";
import { getArcaConfig } from "@/lib/payments/arca/config";
import {
  toArcaAmount,
  toArcaCurrencyCode,
} from "@/lib/payments/arca/amounts";
import type {
  ArcaOrderStatusResponse,
  ArcaRegisterResponse,
} from "@/lib/payments/arca/types";
import type { Currency } from "@/lib/money/currency";

const ARCA_FETCH_TIMEOUT_MS = 20_000;

async function postArcaForm<T>(
  path: string,
  fields: Record<string, string>,
): Promise<T> {
  const { baseUrl, username, password } = getArcaConfig();
  const body = new URLSearchParams({
    userName: username,
    password,
    ...fields,
  });

  const response = await fetch(`${baseUrl}/${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
    signal: AbortSignal.timeout(ARCA_FETCH_TIMEOUT_MS),
  });

  if (!response.ok) {
    logger.error("arca_http_error", {
      path,
      status: response.status,
    });
    throw new Error("ArCa gateway request failed");
  }

  return (await response.json()) as T;
}

export type RegisterArcaOrderInput = {
  orderNumber: string;
  amountMinor: number;
  currency: Currency;
  returnUrl: string;
  description: string;
  language: "hy" | "en" | "ru";
};

/** Registers an order in ArCa and returns the bank payment form URL. */
export async function registerArcaOrder(
  input: RegisterArcaOrderInput,
): Promise<{ providerOrderId: string; formUrl: string }> {
  const payload = await postArcaForm<ArcaRegisterResponse>("register.do", {
    orderNumber: input.orderNumber,
    amount: String(toArcaAmount(input.amountMinor, input.currency)),
    currency: toArcaCurrencyCode(input.currency),
    returnUrl: input.returnUrl,
    description: input.description.slice(0, 512),
    language: input.language,
    jsonParams: JSON.stringify({ FORCE_3DS2: "true" }),
  });

  const errorCode = String(payload.errorCode ?? "0");
  // errorCode 1 = orderNumber already registered; formUrl may still be usable for retry.
  if (
    (errorCode === "0" || errorCode === "1") &&
    payload.orderId &&
    payload.formUrl
  ) {
    return {
      providerOrderId: payload.orderId,
      formUrl: payload.formUrl,
    };
  }

  logger.warn("arca_register_failed", {
    orderNumber: input.orderNumber,
    errorCode,
    errorMessage: payload.errorMessage ?? null,
  });
  throw new Error(payload.errorMessage ?? "ArCa registration failed");
}

/** Loads authoritative order status from ArCa (do not trust returnUrl params). */
export async function getArcaOrderStatus(
  providerOrderId: string,
): Promise<ArcaOrderStatusResponse> {
  return postArcaForm<ArcaOrderStatusResponse>("getOrderStatusExtended.do", {
    orderId: providerOrderId,
  });
}
