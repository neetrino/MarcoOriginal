import { createHash } from "node:crypto";

import { safeEqualString } from "@/lib/payments/webhook-guards";

export type IdramChecksumFields = {
  recAccount: string;
  amount: string;
  secretKey: string;
  billNo: string;
  payerAccount: string;
  transId: string;
  transDate: string;
};

/** Builds Idram MD5 checksum per merchant API field order. */
export function computeIdramChecksum(fields: IdramChecksumFields): string {
  const raw = [
    fields.recAccount,
    fields.amount,
    fields.secretKey,
    fields.billNo,
    fields.payerAccount,
    fields.transId,
    fields.transDate,
  ].join(":");

  return createHash("md5").update(raw, "utf8").digest("hex").toUpperCase();
}

/** Case-insensitive checksum compare. */
export function verifyIdramChecksum(
  fields: IdramChecksumFields,
  received: string,
): boolean {
  const expected = computeIdramChecksum(fields);
  return safeEqualString(expected, received.trim().toUpperCase());
}
