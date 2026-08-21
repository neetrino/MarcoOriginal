/** Status pill classes — storefront-shaped, semantic colors. */
export function orderStatusBadgeClass(status: string): string {
  const normalized = status.toUpperCase();
  if (normalized === "PENDING" || normalized === "CONFIRMED") {
    return "bg-marco-yellow/30 text-marco-slate";
  }
  if (normalized === "PROCESSING" || normalized === "SHIPPED") {
    return "bg-blue-100 text-blue-800";
  }
  if (normalized === "DELIVERED") {
    return "bg-green-100 text-green-800";
  }
  if (normalized === "CANCELLED" || normalized === "REFUNDED") {
    return "bg-red-100 text-red-800";
  }
  return "bg-marco-gray text-marco-slate";
}

export function paymentStatusBadgeClass(status: string): string {
  const normalized = status.toUpperCase();
  if (normalized === "PAID" || normalized === "CAPTURED") {
    return "bg-green-100 text-green-800";
  }
  if (normalized === "PENDING" || normalized === "AUTHORIZED") {
    return "bg-marco-yellow/30 text-marco-slate";
  }
  if (
    normalized === "FAILED" ||
    normalized === "CANCELLED" ||
    normalized === "REFUNDED"
  ) {
    return "bg-red-100 text-red-800";
  }
  return "bg-marco-gray text-marco-slate";
}

export const ADMIN_BADGE =
  "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium";
