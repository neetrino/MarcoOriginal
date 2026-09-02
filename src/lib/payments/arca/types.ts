export type ArcaRegisterResponse = {
  orderId?: string;
  formUrl?: string;
  errorCode?: string | number;
  errorMessage?: string;
};

export type ArcaOrderStatusResponse = {
  errorCode?: string | number;
  orderNumber?: string;
  orderStatus?: number;
  actionCode?: number;
  paymentAmountInfo?: {
    paymentState?: string;
    approvedAmount?: number;
    depositedAmount?: number;
  };
  errorMessage?: string;
};

export type ArcaPaymentState =
  | "CREATED"
  | "APPROVED"
  | "DEPOSITED"
  | "DECLINED"
  | "REVERSED"
  | "REFUNDED"
  | "UNKNOWN";

/** Maps ArCa gateway status to a coarse payment outcome. */
export function resolveArcaPaymentOutcome(
  status: ArcaOrderStatusResponse,
): "captured" | "failed" | "pending" {
  const state = (
    status.paymentAmountInfo?.paymentState ?? ""
  ).toUpperCase();
  if (state === "DEPOSITED" || status.orderStatus === 2) {
    return "captured";
  }
  if (
    state === "DECLINED" ||
    state === "REVERSED" ||
    status.orderStatus === 3 ||
    status.orderStatus === 4
  ) {
    return "failed";
  }
  return "pending";
}
