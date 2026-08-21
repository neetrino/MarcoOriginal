"use client";

import type { ReactNode } from "react";

import { SelectDropdown } from "@/components/ui/SelectDropdown";
import type { CheckoutPaymentMethod } from "@/features/checkout/domain/payment-methods";
import { CheckoutPaymentMethods } from "@/features/checkout/ui/CheckoutPaymentMethods";
import {
  CHECKOUT_CARD_CLASS,
  CHECKOUT_FIELD_LABEL_CLASS,
  CHECKOUT_FULFILLMENT_ACTIVE_CLASS,
  CHECKOUT_FULFILLMENT_BUTTON_CLASS,
  CHECKOUT_FULFILLMENT_IDLE_CLASS,
  CHECKOUT_INPUT_CLASS,
  CHECKOUT_SECTION_TITLE_CLASS,
  CHECKOUT_SELECT_TRIGGER_CLASS,
  CHECKOUT_TEXTAREA_CLASS,
} from "@/features/checkout/ui/checkout-section-classes";
import type { CheckoutDeliveryOption } from "@/features/delivery/application/queries";

export type CheckoutPickupBranch = {
  id: string;
  label: string;
};

type CheckoutDetailsLabels = {
  contactInformation: string;
  shippingMethod: string;
  paymentMethod: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
  notesPlaceholder: string;
  deliveryLocation: string;
  selectLocation: string;
  phonePlaceholder: string;
  addressPlaceholder: string;
  pickupToggle: string;
  deliveryToggle: string;
  branchAddress: string;
  selectBranch: string;
};

type PaymentOption = {
  id: CheckoutPaymentMethod;
  name: string;
  description: string;
};

type CheckoutDetailsSectionsProps = {
  labels: CheckoutDetailsLabels;
  pending: boolean;
  shippingMethod: "pickup" | "delivery";
  onShippingMethodChange: (method: "pickup" | "delivery") => void;
  pickupBranches: CheckoutPickupBranch[];
  pickupBranchId: string;
  onPickupBranchChange: (branchId: string) => void;
  deliveryOptions: CheckoutDeliveryOption[];
  deliveryRuleId: string;
  onDeliveryRuleChange: (ruleId: string) => void;
  paymentMethod: CheckoutPaymentMethod;
  onPaymentMethodChange: (method: CheckoutPaymentMethod) => void;
  paymentOptions: PaymentOption[];
  defaultFirstName: string;
  defaultLastName: string;
  defaultEmail: string;
  defaultPhone: string;
  defaultLine1: string;
};

function LabeledField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className={CHECKOUT_FIELD_LABEL_CLASS}>{label}</span>
      {children}
    </label>
  );
}

export function CheckoutDetailsSections({
  labels,
  pending,
  shippingMethod,
  onShippingMethodChange,
  pickupBranches,
  pickupBranchId,
  onPickupBranchChange,
  deliveryOptions,
  deliveryRuleId,
  onDeliveryRuleChange,
  paymentMethod,
  onPaymentMethodChange,
  paymentOptions,
  defaultFirstName,
  defaultLastName,
  defaultEmail,
  defaultPhone,
  defaultLine1,
}: CheckoutDetailsSectionsProps) {
  return (
    <div className="flex flex-col gap-6 lg:col-span-2">
      <section className={CHECKOUT_CARD_CLASS}>
        <h2 className={CHECKOUT_SECTION_TITLE_CLASS}>
          {labels.contactInformation}
        </h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <LabeledField label={labels.firstName}>
              <input
                name="firstName"
                required
                defaultValue={defaultFirstName}
                disabled={pending}
                className={CHECKOUT_INPUT_CLASS}
                autoComplete="given-name"
              />
            </LabeledField>
            <LabeledField label={labels.lastName}>
              <input
                name="lastName"
                required
                defaultValue={defaultLastName}
                disabled={pending}
                className={CHECKOUT_INPUT_CLASS}
                autoComplete="family-name"
              />
            </LabeledField>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <LabeledField label={labels.email}>
              <input
                name="contactEmail"
                type="email"
                required
                defaultValue={defaultEmail}
                disabled={pending}
                className={CHECKOUT_INPUT_CLASS}
                autoComplete="email"
              />
            </LabeledField>
            <LabeledField label={labels.phone}>
              <input
                name="contactPhone"
                type="tel"
                required
                defaultValue={defaultPhone}
                placeholder={labels.phonePlaceholder}
                disabled={pending}
                className={CHECKOUT_INPUT_CLASS}
                autoComplete="tel"
              />
            </LabeledField>
          </div>
          <LabeledField label={labels.notes}>
            <textarea
              name="notes"
              rows={4}
              placeholder={labels.notesPlaceholder}
              disabled={pending}
              className={CHECKOUT_TEXTAREA_CLASS}
            />
          </LabeledField>
        </div>
      </section>

      <section className={CHECKOUT_CARD_CLASS}>
        <h2 className={CHECKOUT_SECTION_TITLE_CLASS}>{labels.shippingMethod}</h2>
        <div className="mb-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={pending}
            onClick={() => onShippingMethodChange("pickup")}
            className={`${CHECKOUT_FULFILLMENT_BUTTON_CLASS} ${
              shippingMethod === "pickup"
                ? CHECKOUT_FULFILLMENT_ACTIVE_CLASS
                : CHECKOUT_FULFILLMENT_IDLE_CLASS
            }`}
          >
            {labels.pickupToggle}
          </button>
          <button
            type="button"
            disabled={pending || deliveryOptions.length === 0}
            onClick={() => onShippingMethodChange("delivery")}
            className={`${CHECKOUT_FULFILLMENT_BUTTON_CLASS} ${
              shippingMethod === "delivery"
                ? CHECKOUT_FULFILLMENT_ACTIVE_CLASS
                : CHECKOUT_FULFILLMENT_IDLE_CLASS
            }`}
          >
            {labels.deliveryToggle}
          </button>
        </div>
        <input type="hidden" name="shippingMethod" value={shippingMethod} />
        {shippingMethod === "pickup" ? (
          <div>
            <span className={CHECKOUT_FIELD_LABEL_CLASS}>
              {labels.branchAddress}
            </span>
            <SelectDropdown
              name="pickupBranchId"
              ariaLabel={labels.branchAddress}
              value={pickupBranchId}
              allLabel={labels.selectBranch}
              options={pickupBranches.map((branch) => ({
                label: branch.label,
                value: branch.id,
              }))}
              disabled={pending}
              onValueChange={onPickupBranchChange}
              triggerClassName={CHECKOUT_SELECT_TRIGGER_CLASS}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-start">
            <div>
              <span className={CHECKOUT_FIELD_LABEL_CLASS}>
                {labels.deliveryLocation}
              </span>
              <SelectDropdown
                name="deliveryRuleId"
                ariaLabel={labels.deliveryLocation}
                value={deliveryRuleId}
                allLabel={labels.selectLocation}
                options={deliveryOptions.map((option) => ({
                  label: option.label,
                  value: option.id,
                }))}
                disabled={pending || deliveryOptions.length === 0}
                onValueChange={onDeliveryRuleChange}
                triggerClassName={CHECKOUT_SELECT_TRIGGER_CLASS}
              />
            </div>
            <LabeledField label={labels.address}>
              <input
                name="line1"
                required={shippingMethod === "delivery"}
                defaultValue={defaultLine1}
                placeholder={labels.addressPlaceholder}
                disabled={pending}
                className={CHECKOUT_INPUT_CLASS}
                autoComplete="street-address"
              />
            </LabeledField>
          </div>
        )}
      </section>

      <CheckoutPaymentMethods
        title={labels.paymentMethod}
        options={paymentOptions}
        value={paymentMethod}
        onChange={onPaymentMethodChange}
        disabled={pending}
      />
    </div>
  );
}
