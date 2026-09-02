import "server-only";

import { getEnv } from "@/config/env";

export type IdramConfig = {
  testMode: boolean;
  recAccount: string;
  secretKey: string;
  getPaymentUrl: string;
};

/** Resolves Idram merchant credentials from env (test vs live). */
export function getIdramConfig(): IdramConfig {
  const env = getEnv();
  const testMode = env.IDRAM_TEST_MODE === true;
  const recAccount = testMode
    ? env.IDRAM_REC_ACCOUNT
    : env.IDRAM_LIVE_REC_ACCOUNT;
  const secretKey = testMode
    ? env.IDRAM_SECRET_KEY
    : env.IDRAM_LIVE_SECRET_KEY;

  if (!recAccount || !secretKey) {
    throw new Error("Idram credentials are not configured");
  }

  return {
    testMode,
    recAccount,
    secretKey,
    getPaymentUrl:
      env.IDRAM_GET_PAYMENT_URL ??
      "https://banking.idram.am/Payment/GetPayment",
  };
}

/** True when live or test Idram credentials are present. */
export function isIdramConfigured(): boolean {
  const env = getEnv();
  if (env.IDRAM_TEST_MODE === true) {
    return Boolean(env.IDRAM_REC_ACCOUNT && env.IDRAM_SECRET_KEY);
  }
  return Boolean(env.IDRAM_LIVE_REC_ACCOUNT && env.IDRAM_LIVE_SECRET_KEY);
}
