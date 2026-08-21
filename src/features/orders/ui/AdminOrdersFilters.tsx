"use client";

import { useRef, useState } from "react";
import { flushSync } from "react-dom";

import { Card } from "@/components/ui/Card";
import { SelectDropdown } from "@/components/ui/SelectDropdown";
import { AdminSearchInput } from "@/features/admin/ui/AdminSearchInput";
import {
  formatAdminMessage,
  getAdminCopy,
} from "@/features/admin/ui/get-admin-copy";
import type { OrderStatus } from "@/features/orders/domain/order-status";
import type { PaymentStatus } from "@/features/orders/domain/payment-status";

type AdminOrdersFiltersProps = {
  locale: string;
  total: number;
  status?: OrderStatus;
  paymentStatus?: string;
  q?: string;
};

export function AdminOrdersFilters({
  locale,
  total,
  status,
  paymentStatus,
  q,
}: AdminOrdersFiltersProps) {
  const copy = getAdminCopy(locale).orders;
  const formRef = useRef<HTMLFormElement>(null);
  const [statusValue, setStatusValue] = useState(status ?? "");
  const [paymentValue, setPaymentValue] = useState(paymentStatus ?? "");

  const orderStatusFilters: ReadonlyArray<{
    label: string;
    value: OrderStatus;
  }> = [
    { label: copy.statusPending, value: "PENDING" },
    { label: copy.statusProcessing, value: "PROCESSING" },
    { label: copy.statusCompleted, value: "DELIVERED" },
    { label: copy.statusCancelled, value: "CANCELLED" },
  ];

  const paymentStatusFilters: ReadonlyArray<{
    label: string;
    value: PaymentStatus;
  }> = [
    { label: copy.paymentPaid, value: "CAPTURED" },
    { label: copy.paymentPending, value: "PENDING" },
    { label: copy.paymentFailed, value: "FAILED" },
  ];

  function applyStatus(next: string): void {
    flushSync(() => setStatusValue(next));
    formRef.current?.requestSubmit();
  }

  function applyPayment(next: string): void {
    flushSync(() => setPaymentValue(next));
    formRef.current?.requestSubmit();
  }

  return (
    <Card className="mb-6 overflow-visible rounded-2xl">
      <form
        ref={formRef}
        method="get"
        className="flex flex-col gap-3 p-4 sm:flex-nowrap sm:flex-row sm:items-center"
      >
        <SelectDropdown
          name="status"
          ariaLabel={copy.statusAria}
          value={statusValue}
          allLabel={copy.allStatuses}
          options={orderStatusFilters}
          className="w-[180px] shrink-0"
          onValueChange={applyStatus}
        />
        <SelectDropdown
          name="paymentStatus"
          ariaLabel={copy.paymentAria}
          value={paymentValue}
          allLabel={copy.allPayments}
          options={paymentStatusFilters}
          className="w-[200px] shrink-0"
          onValueChange={applyPayment}
        />
        <AdminSearchInput
          name="q"
          defaultValue={q ?? ""}
          placeholder={copy.searchPlaceholder}
          wrapperClassName="min-w-0 flex-1"
          aria-label={copy.searchAria}
        />
      </form>
      <div className="border-t border-gray-200 px-4 py-3">
        <p className="text-sm text-marco-slate/70">
          {formatAdminMessage(copy.listTotal, { count: total })}
        </p>
      </div>
    </Card>
  );
}
