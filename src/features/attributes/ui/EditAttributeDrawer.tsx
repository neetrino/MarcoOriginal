"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { SideSheet } from "@/components/ui/SideSheet";
import {
  ADMIN_INPUT,
  ADMIN_LABEL,
} from "@/features/admin/ui/admin-form-classes";
import { updateAttributeFromDrawerAction } from "@/features/attributes/actions";
import type { AdminAttributeListItem } from "@/features/attributes/domain/attribute-admin-model";
import type { AdminAttributesCopy } from "@/features/attributes/ui/admin-attributes-copy";

type EditAttributeDrawerProps = {
  locale: string;
  open: boolean;
  attribute: AdminAttributeListItem | null;
  copy: AdminAttributesCopy;
  onClose: () => void;
};

export function EditAttributeDrawer({
  locale,
  open,
  attribute,
  copy,
  onClose,
}: EditAttributeDrawerProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [prevOpen, setPrevOpen] = useState(open);
  const [prevAttribute, setPrevAttribute] = useState(attribute);

  if (open !== prevOpen || attribute !== prevAttribute) {
    setPrevOpen(open);
    setPrevAttribute(attribute);
    if (open) {
      setTitle(attribute?.title ?? "");
      setError(null);
    }
  }

  return (
    <SideSheet
      open={open}
      onClose={onClose}
      ariaLabel={copy.drawerEdit}
      panelClassName="w-1/2 min-w-[20rem] max-w-full"
    >
      <div className="border-b border-gray-200 px-5 py-4">
        <h2 className="text-lg font-semibold text-gray-900">{copy.drawerEdit}</h2>
      </div>

      {attribute ? (
        <form
          className="flex min-h-0 flex-1 flex-col"
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData();
            formData.set("title", title.trim());

            startTransition(async () => {
              setError(null);
              const result = await updateAttributeFromDrawerAction(
                locale,
                attribute.id,
                formData,
              );
              if (!result.ok) {
                setError(result.error.message);
                return;
              }
              onClose();
              router.refresh();
            });
          }}
        >
          <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
            <label className="block">
              <span className={ADMIN_LABEL}>
                {copy.nameLabel} <span className="text-red-600">*</span>
              </span>
              <input
                required
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder={copy.namePlaceholder}
                className={ADMIN_INPUT}
                disabled={isPending}
              />
            </label>
            <p className="text-xs text-gray-500">
              {copy.keyLabel}: {attribute.key}
            </p>
            {error ? <p className="text-sm text-red-700">{error}</p> : null}
          </div>

          <div className="flex items-center gap-3 border-t border-gray-200 px-5 py-4">
            <Button type="submit" disabled={isPending || !title.trim()}>
              {isPending ? copy.saving : copy.submitSave}
            </Button>
            <button
              type="button"
              onClick={onClose}
              className="whitespace-nowrap text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              {copy.cancel}
            </button>
          </div>
        </form>
      ) : null}
    </SideSheet>
  );
}
