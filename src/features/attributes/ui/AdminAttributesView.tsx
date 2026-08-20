"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/Button";
import {
  ConfirmDialog,
  deleteConfirmDescription,
} from "@/components/ui/ConfirmDialog";
import { ADMIN_PAGE_TITLE } from "@/features/admin/ui/admin-form-classes";
import { AdminSearchInput } from "@/features/admin/ui/AdminSearchInput";
import { deleteAttributeAction } from "@/features/attributes/actions";
import type { AdminAttributeListItem } from "@/features/attributes/domain/attribute-admin-model";
import type { AdminAttributesCopy } from "@/features/attributes/ui/admin-attributes-copy";
import { AddAttributeDrawer } from "@/features/attributes/ui/AddAttributeDrawer";
import { AdminAttributeCard } from "@/features/attributes/ui/AdminAttributeCard";
import { EditAttributeDrawer } from "@/features/attributes/ui/EditAttributeDrawer";

type AdminAttributesViewProps = {
  locale: string;
  attributes: AdminAttributeListItem[];
  copy: AdminAttributesCopy;
};

export function AdminAttributesView({
  locale,
  attributes,
  copy,
}: AdminAttributesViewProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<ReadonlySet<string>>(
    () => new Set(),
  );
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [pendingDelete, setPendingDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const needle = query.trim().toLowerCase();
  const visible = useMemo(() => {
    if (!needle) return attributes;
    return attributes.filter((attribute) => {
      if (attribute.title.toLowerCase().includes(needle)) return true;
      if (attribute.key.toLowerCase().includes(needle)) return true;
      return attribute.values.some((value) =>
        value.title.toLowerCase().includes(needle),
      );
    });
  }, [attributes, needle]);

  const editingAttribute =
    attributes.find((attribute) => attribute.id === editingId) ?? null;

  function toggleExpanded(id: string): void {
    setExpandedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function confirmDelete(): void {
    if (!pendingDelete) return;
    const attributeId = pendingDelete.id;

    startTransition(async () => {
      setError(null);
      const result = await deleteAttributeAction(locale, attributeId);
      if (!result.ok) {
        setError(result.error.message);
        return;
      }
      setPendingDelete(null);
      if (editingId === attributeId) setEditingId(null);
      setExpandedIds((current) => {
        const next = new Set(current);
        next.delete(attributeId);
        return next;
      });
      router.refresh();
    });
  }

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className={ADMIN_PAGE_TITLE}>{copy.title}</h1>
        <Button
          type="button"
          size="sm"
          onClick={() => setAddOpen(true)}
          className="inline-flex items-center gap-1.5"
        >
          <Plus className="h-4 w-4" aria-hidden />
          {copy.addAttribute}
        </Button>
      </div>

      <AdminSearchInput
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={copy.searchPlaceholder}
        wrapperClassName="mb-4"
        aria-label={copy.searchLabel}
      />

      {error ? <p className="mb-3 text-sm text-red-700">{error}</p> : null}

      {visible.length === 0 ? (
        <p className="rounded-2xl border border-gray-200 bg-white px-4 py-8 text-sm text-gray-600">
          {attributes.length === 0 ? copy.empty : copy.noMatch}
        </p>
      ) : (
        <div className="space-y-3">
          {visible.map((attribute) => (
            <AdminAttributeCard
              key={attribute.id}
              locale={locale}
              attribute={attribute}
              copy={copy}
              expanded={expandedIds.has(attribute.id)}
              onToggle={() => toggleExpanded(attribute.id)}
              onEdit={() => setEditingId(attribute.id)}
              onDelete={() =>
                setPendingDelete({
                  id: attribute.id,
                  title: attribute.title,
                })
              }
              disabled={isPending}
              onError={setError}
            />
          ))}
        </div>
      )}

      <AddAttributeDrawer
        locale={locale}
        open={addOpen}
        attributes={attributes}
        copy={copy}
        onClose={() => setAddOpen(false)}
        onCreated={(created) => {
          setAddOpen(false);
          setExpandedIds((current) => new Set(current).add(created.id));
        }}
        onSelectExisting={(id) => {
          setAddOpen(false);
          setExpandedIds((current) => new Set(current).add(id));
        }}
      />

      <EditAttributeDrawer
        locale={locale}
        open={editingId !== null}
        attribute={editingAttribute}
        copy={copy}
        onClose={() => setEditingId(null)}
      />

      <ConfirmDialog
        open={pendingDelete !== null}
        title={copy.deleteTitle}
        description={
          pendingDelete
            ? deleteConfirmDescription(copy.entity, pendingDelete.title)
            : ""
        }
        isPending={isPending}
        onClose={() => {
          if (!isPending) setPendingDelete(null);
        }}
        onConfirm={confirmDelete}
      />
    </section>
  );
}
