"use client";

import { Pencil, Trash2 } from "lucide-react";

import type { CustomerAddressListItem } from "@/features/profile/application/address-queries";
import {
  PROFILE_ADDRESS_CARD_CLASS,
  PROFILE_DEFAULT_BADGE_CLASS,
  PROFILE_OUTLINE_BUTTON_CLASS,
} from "@/features/profile/ui/profile-surface-classes";

type ProfileAddressCardProps = {
  address: CustomerAddressListItem;
  disabled: boolean;
  labels: {
    defaultBadge: string;
    setDefault: string;
    edit: string;
    delete: string;
  };
  onSetDefault: (addressId: string) => void;
  onEdit: (address: CustomerAddressListItem) => void;
  onDelete: (addressId: string) => void;
};

export function ProfileAddressCard({
  address,
  disabled,
  labels,
  onSetDefault,
  onEdit,
  onDelete,
}: ProfileAddressCardProps) {
  const isDefault = address.isDefaultShipping;

  return (
    <div
      className={`relative flex h-full flex-col p-4 pr-14 sm:p-5 sm:pr-14 lg:p-6 lg:pr-14 ${PROFILE_ADDRESS_CARD_CLASS}`}
    >
      <div className="absolute top-3 right-3 flex items-center gap-0.5 sm:top-4 sm:right-4">
        <button
          type="button"
          onClick={() => onEdit(address)}
          disabled={disabled}
          className="inline-flex h-7 w-7 items-center justify-center rounded-full text-marco-slate/60 transition-colors hover:bg-marco-gray hover:text-marco-slate disabled:opacity-50"
          aria-label={labels.edit}
          title={labels.edit}
        >
          <Pencil className="h-4.5 w-4.5" aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => onDelete(address.id)}
          disabled={disabled}
          className="inline-flex h-7 w-7 items-center justify-center rounded-full text-marco-slate/60 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
          aria-label={labels.delete}
          title={labels.delete}
        >
          <Trash2 className="h-4.5 w-4.5" aria-hidden />
        </button>
      </div>

      <div className="min-w-0 flex-1 space-y-2">
        {isDefault ? (
          <span className={PROFILE_DEFAULT_BADGE_CLASS}>
            {labels.defaultBadge}
          </span>
        ) : null}
        <p className="text-sm leading-snug font-medium break-words text-marco-slate sm:text-base">
          {address.line1}
        </p>
        <p className="text-sm leading-snug break-words text-marco-slate/80 sm:text-base">
          {address.city}
        </p>
      </div>

      {!isDefault ? (
        <div className="mt-4">
          <button
            type="button"
            className={`${PROFILE_OUTLINE_BUTTON_CLASS} w-full sm:w-auto`}
            onClick={() => onSetDefault(address.id)}
            disabled={disabled}
          >
            {labels.setDefault}
          </button>
        </div>
      ) : null}
    </div>
  );
}
