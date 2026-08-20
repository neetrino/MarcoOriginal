"use client";

import { useState, useTransition, type Dispatch, type SetStateAction } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { SideSheet } from "@/components/ui/SideSheet";
import {
  ADMIN_INPUT,
  ADMIN_LABEL,
} from "@/features/admin/ui/admin-form-classes";
import {
  createHeroSlideAction,
  updateHeroSlideAction,
} from "@/features/hero/application/manage-hero";
import type { AdminHeroSlideListItem } from "@/features/hero/application/queries";
import { AdminHeroImageField } from "@/features/hero/ui/AdminHeroImageField";

type HeroSlideModalProps = {
  locale: string;
  open: boolean;
  onClose: () => void;
  slide?: AdminHeroSlideListItem | null;
};

type ImageDraft = {
  file: File | null;
  previewUrl: string | null;
  removeExisting: boolean;
};

function revokeIfBlob(url: string | null): void {
  if (url?.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
}

export function HeroSlideModal({
  locale,
  open,
  onClose,
  slide = null,
}: HeroSlideModalProps) {
  const isEdit = slide != null;

  return (
    <SideSheet
      open={open}
      onClose={onClose}
      ariaLabel={isEdit ? "Edit Hero Banner" : "Add Hero Banner"}
      panelClassName="w-full max-w-lg"
    >
      <HeroSlideDrawerForm
        key={slide?.id ?? "create"}
        locale={locale}
        onClose={onClose}
        slide={slide}
      />
    </SideSheet>
  );
}

type HeroSlideDrawerFormProps = {
  locale: string;
  onClose: () => void;
  slide: AdminHeroSlideListItem | null;
};

function HeroSlideDrawerForm({
  locale,
  onClose,
  slide,
}: HeroSlideDrawerFormProps) {
  const router = useRouter();
  const isEdit = slide != null;
  const [title, setTitle] = useState(
    slide && slide.title !== "Untitled" ? slide.title : "",
  );
  const [subtitle, setSubtitle] = useState(slide?.subtitle ?? "");
  const [buttonLabel, setButtonLabel] = useState(slide?.buttonLabel ?? "");
  const [buttonUrl, setButtonUrl] = useState(slide?.buttonUrl ?? "");
  const [desktop, setDesktop] = useState<ImageDraft>({
    file: null,
    previewUrl: slide?.desktopImageUrl ?? null,
    removeExisting: false,
  });
  const [mobile, setMobile] = useState<ImageDraft>({
    file: null,
    previewUrl: slide?.mobileImageUrl ?? null,
    removeExisting: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function selectImage(
    setter: Dispatch<SetStateAction<ImageDraft>>,
    file: File,
  ): void {
    setter((current) => {
      revokeIfBlob(current.previewUrl);
      return {
        file,
        previewUrl: URL.createObjectURL(file),
        removeExisting: false,
      };
    });
  }

  function removeImage(
    setter: Dispatch<SetStateAction<ImageDraft>>,
    hadExisting: boolean,
  ): void {
    setter((current) => {
      revokeIfBlob(current.previewUrl);
      return {
        file: null,
        previewUrl: null,
        removeExisting: isEdit && hadExisting,
      };
    });
  }

  function submitForm(): void {
    const formData = new FormData();
    formData.set("title", title.trim());
    formData.set("subtitle", subtitle.trim());
    formData.set("buttonLabel", buttonLabel.trim());
    formData.set("buttonUrl", buttonUrl.trim());
    if (desktop.file) formData.set("desktopImage", desktop.file);
    if (mobile.file) formData.set("mobileImage", mobile.file);
    if (desktop.removeExisting) formData.set("removeDesktopImage", "1");
    if (mobile.removeExisting) formData.set("removeMobileImage", "1");

    startTransition(async () => {
      setError(null);
      const result =
        isEdit && slide
          ? await updateHeroSlideAction(locale, slide.id, formData)
          : await createHeroSlideAction(locale, formData);

      if (!result.ok) {
        setError(result.error.message);
        return;
      }

      onClose();
      router.refresh();
    });
  }

  return (
    <>
      <div className="border-b border-gray-200 px-5 py-4">
        <h2 className="text-lg font-semibold text-gray-900">
          {isEdit ? "Edit Hero Banner" : "Add Hero Banner"}
        </h2>
      </div>

      <form
        className="flex min-h-0 flex-1 flex-col"
        onSubmit={(event) => {
          event.preventDefault();
          submitForm();
        }}
      >
        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
          <label className="block">
            <span className={ADMIN_LABEL}>
              Title <span className="text-red-600">*</span>
            </span>
            <input
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className={ADMIN_INPUT}
              disabled={isPending}
            />
          </label>

          <label className="block">
            <span className={ADMIN_LABEL}>Subtitle</span>
            <input
              value={subtitle}
              onChange={(event) => setSubtitle(event.target.value)}
              className={ADMIN_INPUT}
              disabled={isPending}
            />
          </label>

          <label className="block">
            <span className={ADMIN_LABEL}>Button Label</span>
            <input
              value={buttonLabel}
              onChange={(event) => setButtonLabel(event.target.value)}
              className={ADMIN_INPUT}
              disabled={isPending}
            />
          </label>

          <label className="block">
            <span className={ADMIN_LABEL}>Button URL</span>
            <input
              value={buttonUrl}
              onChange={(event) => setButtonUrl(event.target.value)}
              placeholder="/hy/products"
              className={ADMIN_INPUT}
              disabled={isPending}
            />
          </label>

          <AdminHeroImageField
            label="Desktop Image"
            hint="Shown on tablet and desktop widths."
            previewUrl={desktop.previewUrl}
            disabled={isPending}
            onSelect={(file) => selectImage(setDesktop, file)}
            onRemove={() => removeImage(setDesktop, Boolean(slide?.desktopImageUrl))}
          />

          <AdminHeroImageField
            label="Mobile Image"
            hint="Shown on phones. Falls back to desktop if empty."
            previewUrl={mobile.previewUrl}
            disabled={isPending}
            onSelect={(file) => selectImage(setMobile, file)}
            onRemove={() => removeImage(setMobile, Boolean(slide?.mobileImageUrl))}
          />

          {error ? <p className="text-sm text-red-700">{error}</p> : null}
        </div>

        <div className="flex items-center gap-4 border-t border-gray-200 px-5 py-4">
          <Button type="submit" disabled={isPending || !title.trim()}>
            {isPending
              ? isEdit
                ? "Saving…"
                : "Creating…"
              : isEdit
                ? "Save"
                : "Create Hero Banner"}
          </Button>
          <button
            type="button"
            onClick={onClose}
            className="whitespace-nowrap text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}
