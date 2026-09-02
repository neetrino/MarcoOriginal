import "server-only";

import { getEnv } from "@/config/env";

export type ArcaBank = "idbank" | "inecobank";

export type ArcaConfig = {
  testMode: boolean;
  bank: ArcaBank;
  username: string;
  password: string;
  baseUrl: string;
};

const BANK_BASE_URLS: Record<
  ArcaBank,
  { test: string; live: string }
> = {
  idbank: {
    test: "https://ipaytest.arca.am:8445/payment/rest",
    live: "https://ipay.arca.am/payment/rest",
  },
  inecobank: {
    test: "https://pg.inecoecom.am/payment/rest",
    live: "https://pg.inecoecom.am/payment/rest",
  },
};

function parseBank(value: string | undefined): ArcaBank {
  if (value === "inecobank") return "inecobank";
  return "idbank";
}

/** Resolves ArCa credentials and gateway base URL from env. */
export function getArcaConfig(): ArcaConfig {
  const env = getEnv();
  const testMode = env.ARCA_TEST_MODE === true;
  const bank = parseBank(env.ARCA_BANK);
  const username = testMode
    ? env.ARCA_USERNAME
    : env.ARCA_LIVE_USERNAME;
  const password = testMode
    ? env.ARCA_PASSWORD
    : env.ARCA_LIVE_PASSWORD;

  if (!username || !password) {
    throw new Error("ArCa credentials are not configured");
  }

  const urls = BANK_BASE_URLS[bank];
  return {
    testMode,
    bank,
    username,
    password,
    baseUrl: testMode ? urls.test : urls.live,
  };
}

/** True when live or test ArCa credentials are present. */
export function isArcaConfigured(): boolean {
  const env = getEnv();
  if (env.ARCA_TEST_MODE === true) {
    return Boolean(env.ARCA_USERNAME && env.ARCA_PASSWORD);
  }
  return Boolean(env.ARCA_LIVE_USERNAME && env.ARCA_LIVE_PASSWORD);
}
