import { describe, expect, it } from "vitest";

import { toArcaAmount, toArcaCurrencyCode } from "@/lib/payments/arca/amounts";
import {
  computeIdramChecksum,
  verifyIdramChecksum,
} from "@/lib/payments/idram/checksum";
import {
  idramAmountsMatch,
  toIdramAmountString,
} from "@/lib/payments/idram/amounts";

describe("toArcaAmount", () => {
  it("multiplies AMD whole dram by 100 for the gateway", () => {
    expect(toArcaAmount(1000, "AMD")).toBe(100_000);
  });

  it("passes through USD minor units", () => {
    expect(toArcaAmount(1050, "USD")).toBe(1050);
  });

  it("maps currency codes", () => {
    expect(toArcaCurrencyCode("AMD")).toBe("051");
    expect(toArcaCurrencyCode("USD")).toBe("840");
  });
});

describe("idram amounts", () => {
  it("formats AMD as major units", () => {
    expect(toIdramAmountString(1900, "AMD")).toBe("1900");
  });

  it("matches callback amounts with tolerance", () => {
    expect(idramAmountsMatch("1900", 1900, "AMD")).toBe(true);
    expect(idramAmountsMatch("1900.00", 1900, "AMD")).toBe(true);
    expect(idramAmountsMatch("1899", 1900, "AMD")).toBe(false);
  });
});

describe("idram checksum", () => {
  it("verifies the documented field order", () => {
    const fields = {
      recAccount: "100000114",
      amount: "1900",
      secretKey: "secret",
      billNo: "1806",
      payerAccount: "payer",
      transId: "tx-1",
      transDate: "2026-01-01",
    };
    const digest = computeIdramChecksum(fields);
    expect(verifyIdramChecksum(fields, digest)).toBe(true);
    expect(verifyIdramChecksum(fields, digest.toLowerCase())).toBe(true);
    expect(verifyIdramChecksum(fields, "deadbeef")).toBe(false);
  });
});
