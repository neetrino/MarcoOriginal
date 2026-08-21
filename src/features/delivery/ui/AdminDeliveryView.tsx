"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import {
  ADMIN_PAGE_SUBTITLE,
  ADMIN_SECTION_TITLE,
} from "@/features/admin/ui/admin-form-classes";
import {
  ADMIN_OUTLINE_BUTTON_CLASS,
  ADMIN_YELLOW_BUTTON_CLASS,
} from "@/features/admin/ui/admin-surface-classes";
import {
  formatAdminMessage,
  getAdminCopy,
} from "@/features/admin/ui/get-admin-copy";
import type { AdminDeliveryLocation } from "@/features/delivery/application/queries";
import {
  DELIVERY_ACCENT_BAR,
  DELIVERY_CARD,
  DELIVERY_CARD_BODY,
  DELIVERY_CARD_HEADER,
  DELIVERY_FOOTER,
  DELIVERY_SHELL,
} from "@/features/delivery/ui/delivery-admin.classes";
import { DeliveryLocationCard } from "@/features/delivery/ui/DeliveryLocationCard";
import { DeliveryLocationsEmpty } from "@/features/delivery/ui/DeliveryLocationsEmpty";
import {
  createEmptyDraft,
  isDeliveryEditorDirty,
  locationToDraft,
  locationsResetKey,
  planDeliverySave,
  type DeliveryLocationDraft,
  type DeliveryLocationField,
} from "@/features/delivery/ui/delivery-location-draft";
import { persistDeliveryPlan } from "@/features/delivery/ui/persist-delivery-plan";

type AdminDeliveryViewProps = {
  locale: string;
  locations: AdminDeliveryLocation[];
};

export function AdminDeliveryView(props: AdminDeliveryViewProps) {
  return (
    <AdminDeliveryEditor
      key={locationsResetKey(props.locations)}
      locale={props.locale}
      locations={props.locations}
    />
  );
}

function AdminDeliveryEditor({
  locale,
  locations,
}: AdminDeliveryViewProps) {
  const copy = getAdminCopy(locale).delivery;
  const common = getAdminCopy(locale).common;
  const router = useRouter();
  const [drafts, setDrafts] = useState(() => locations.map(locationToDraft));
  const [pendingDelete, setPendingDelete] =
    useState<DeliveryLocationDraft | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const isDirty = isDeliveryEditorDirty(locations, drafts);

  function addLocation(): void {
    setDrafts((current) => [...current, createEmptyDraft()]);
    setSuccess(null);
  }

  function updateDraft(
    clientId: string,
    field: DeliveryLocationField,
    value: string,
  ): void {
    setDrafts((current) =>
      current.map((draft) =>
        draft.clientId === clientId ? { ...draft, [field]: value } : draft,
      ),
    );
    setSuccess(null);
  }

  function confirmDelete(): void {
    if (!pendingDelete) return;
    setDrafts((current) =>
      current.filter((draft) => draft.clientId !== pendingDelete.clientId),
    );
    setPendingDelete(null);
    setSuccess(null);
  }

  function resetDrafts(): void {
    setDrafts(locations.map(locationToDraft));
    setError(null);
    setSuccess(null);
  }

  function saveDrafts(): void {
    const plan = planDeliverySave(locations, drafts);
    if (!plan.ok) {
      setError(copy.errorSaving);
      setSuccess(null);
      return;
    }

    startTransition(async () => {
      setError(null);
      const result = await persistDeliveryPlan(locale, plan.value);
      if (!result.ok) {
        setError(result.error.message);
        return;
      }
      setSuccess(copy.savedSuccess);
      router.refresh();
    });
  }

  return (
    <section className={DELIVERY_SHELL}>
      <form
        className={DELIVERY_CARD}
        onSubmit={(event) => {
          event.preventDefault();
          if (!isPending && isDirty) saveDrafts();
        }}
      >
        <div className={DELIVERY_CARD_HEADER}>
          <div className={DELIVERY_ACCENT_BAR} />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className={ADMIN_SECTION_TITLE}>{copy.sectionTitle}</h1>
              <p className={`mt-1 ${ADMIN_PAGE_SUBTITLE}`}>{copy.subtitle}</p>
            </div>
            <button
              type="button"
              onClick={addLocation}
              disabled={isPending}
              className={`${ADMIN_YELLOW_BUTTON_CLASS} h-11`}
            >
              <Plus className="h-4 w-4" aria-hidden />
              {copy.addLocation}
            </button>
          </div>
        </div>

        {error ? (
          <p className="px-5 pt-4 text-sm text-red-700 sm:px-6" role="alert">
            {error}
          </p>
        ) : null}
        {success ? (
          <p
            className="px-5 pt-4 text-sm text-marco-slate sm:px-6"
            role="status"
          >
            {success}
          </p>
        ) : null}

        {drafts.length === 0 ? (
          <DeliveryLocationsEmpty
            title={copy.title}
            hint={copy.emptyHint}
            addLabel={copy.addLocation}
            disabled={isPending}
            onAdd={addLocation}
          />
        ) : (
          <div className={DELIVERY_CARD_BODY}>
            {drafts.map((draft, index) => {
              const displayName =
                draft.city.trim() ||
                formatAdminMessage(copy.untitledLocation, {
                  index: index + 1,
                });

              return (
                <DeliveryLocationCard
                  key={draft.clientId}
                  index={index + 1}
                  draft={draft}
                  locale={locale}
                  title={displayName}
                  deleteAria={formatAdminMessage(common.deleteAria, {
                    name: displayName,
                  })}
                  disabled={isPending}
                  copy={copy}
                  onChange={(field, value) =>
                    updateDraft(draft.clientId, field, value)
                  }
                  onDelete={() => setPendingDelete(draft)}
                />
              );
            })}
          </div>
        )}

        <div className={DELIVERY_FOOTER}>
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={isPending || !isDirty}
              className={`${ADMIN_YELLOW_BUTTON_CLASS} h-11 min-w-[160px] flex-1 sm:flex-none`}
            >
              {isPending ? copy.saving : copy.saveSettings}
            </button>
            <button
              type="button"
              onClick={resetDrafts}
              disabled={isPending || !isDirty}
              className={`${ADMIN_OUTLINE_BUTTON_CLASS} h-11 min-w-[140px] flex-1 sm:flex-none`}
            >
              {common.cancel}
            </button>
          </div>
        </div>
      </form>

      <ConfirmDialog
        open={pendingDelete !== null}
        title={common.delete}
        confirmLabel={common.delete}
        cancelLabel={common.cancel}
        description={
          pendingDelete
            ? formatAdminMessage(common.deleteConfirm, {
                entity: copy.entity,
                name: pendingDelete.city.trim() || copy.entity,
              })
            : ""
        }
        isPending={isPending}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </section>
  );
}
