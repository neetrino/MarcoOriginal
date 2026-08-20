"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { SideSheet } from "@/components/ui/SideSheet";
import {
  ADMIN_INPUT,
  ADMIN_LABEL,
} from "@/features/admin/ui/admin-form-classes";
import { AdminSearchInput } from "@/features/admin/ui/AdminSearchInput";
import { createAttributeFromDrawerAction } from "@/features/attributes/actions";
import { generateAttributeKey } from "@/features/attributes/domain/attribute-key";
import type { AdminAttributeListItem } from "@/features/attributes/domain/attribute-admin-model";
import type { AdminAttributesCopy } from "@/features/attributes/ui/admin-attributes-copy";

type AddAttributeDrawerProps = {
  locale: string;
  open: boolean;
  attributes: AdminAttributeListItem[];
  copy: AdminAttributesCopy;
  onClose: () => void;
  onCreated: (attribute: AdminAttributeListItem) => void;
  onSelectExisting: (id: string) => void;
};

export function AddAttributeDrawer({
  locale,
  open,
  attributes,
  copy,
  onClose,
  onCreated,
  onSelectExisting,
}: AddAttributeDrawerProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [prevOpen, setPrevOpen] = useState(open);

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setQuery("");
      setTitle("");
      setError(null);
    }
  }

  const needle = query.trim().toLowerCase();
  const matches = useMemo(() => {
    if (!needle) return [];
    return attributes.filter((attribute) => matchesAttribute(attribute, needle));
  }, [attributes, needle]);

  const keyPreview = title.trim() ? generateAttributeKey(title) : "";

  return (
    <SideSheet
      open={open}
      onClose={onClose}
      ariaLabel={copy.addAttribute}
      panelClassName="w-1/2 min-w-[20rem] max-w-full"
    >
      <div className="border-b border-gray-200 px-5 py-4">
        <h2 className="text-lg font-semibold text-gray-900">
          {copy.addAttribute}
        </h2>
      </div>

      <form
        className="flex min-h-0 flex-1 flex-col"
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData();
          formData.set("title", title.trim());

          startTransition(async () => {
            setError(null);
            const result = await createAttributeFromDrawerAction(
              locale,
              formData,
            );
            if (!result.ok) {
              setError(result.error.message);
              return;
            }
            onCreated({
              id: result.value.id,
              title: result.value.title,
              key: result.value.key,
              values: [],
            });
            router.refresh();
          });
        }}
      >
        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
          <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-gray-900">
              {copy.drawerSearchTitle}
            </h3>
            <AdminSearchInput
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={copy.drawerSearchPlaceholder}
              aria-label={copy.drawerSearchTitle}
            />
            {needle ? (
              <ul className="mt-3 space-y-1">
                {matches.length === 0 ? (
                  <li className="text-sm text-gray-500">{copy.noSearchResults}</li>
                ) : (
                  matches.map((attribute) => (
                    <li key={attribute.id}>
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => onSelectExisting(attribute.id)}
                        className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm hover:bg-gray-50"
                      >
                        <span className="font-medium text-gray-900">
                          {attribute.title}
                        </span>
                        <span className="text-gray-500">{attribute.key}</span>
                      </button>
                    </li>
                  ))
                )}
              </ul>
            ) : null}
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-gray-900">
              {copy.createNew}
            </h3>
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
            <p className="mt-2 text-xs text-gray-500">{copy.keyHint}</p>
            {keyPreview ? (
              <p className="mt-1 text-xs text-gray-400">
                {copy.keyLabel}: {keyPreview}
              </p>
            ) : null}
          </section>

          {error ? <p className="text-sm text-red-700">{error}</p> : null}
        </div>

        <div className="flex items-center gap-3 border-t border-gray-200 px-5 py-4">
          <Button type="submit" disabled={isPending || !title.trim()}>
            {isPending ? copy.creating : copy.submitCreate}
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
    </SideSheet>
  );
}

function matchesAttribute(
  attribute: AdminAttributeListItem,
  needle: string,
): boolean {
  if (attribute.title.toLowerCase().includes(needle)) return true;
  if (attribute.key.toLowerCase().includes(needle)) return true;
  return attribute.values.some((value) => {
    if (value.title.toLowerCase().includes(needle)) return true;
    return (value.colorHex ?? "").toLowerCase().includes(needle);
  });
}
