"use client";

import { useState, useTransition, type FormEvent } from "react";

import { submitContactMessageAction } from "@/features/contact/application/submit-contact";
import { CONTACT_FORM_FIELD_CLASS } from "@/features/contact/ui/contact-section-classes";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

type ContactFormCopy = Dictionary["contact"]["form"];

type ContactFormProps = {
  copy: ContactFormCopy;
};

function fieldPlaceholder(label: string): string {
  return label.replace(/\*/gu, "").trim();
}

function ContactFormFields({
  copy,
  isPending,
}: {
  copy: ContactFormCopy;
  isPending: boolean;
}) {
  return (
    <>
      <input
        name="companyWebsite"
        tabIndex={-1}
        autoComplete="off"
        className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
        aria-hidden
      />
      <input
        id="name"
        name="name"
        type="text"
        required
        maxLength={120}
        aria-label={copy.name}
        placeholder={fieldPlaceholder(copy.name)}
        className={CONTACT_FORM_FIELD_CLASS}
        disabled={isPending}
      />
      <input
        id="email"
        name="email"
        type="email"
        required
        maxLength={254}
        aria-label={copy.email}
        placeholder={fieldPlaceholder(copy.email)}
        className={CONTACT_FORM_FIELD_CLASS}
        disabled={isPending}
      />
      <input
        id="subject"
        name="subject"
        type="text"
        required
        maxLength={160}
        aria-label={copy.subject}
        placeholder={fieldPlaceholder(copy.subject)}
        className={CONTACT_FORM_FIELD_CLASS}
        disabled={isPending}
      />
      <textarea
        id="message"
        name="message"
        required
        minLength={10}
        maxLength={5000}
        rows={4}
        aria-label={copy.message}
        placeholder={copy.message}
        className={`${CONTACT_FORM_FIELD_CLASS} h-auto min-h-[108px] py-2.5`}
        disabled={isPending}
      />
    </>
  );
}

export function ContactForm({ copy }: ContactFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      setError(null);
      const result = await submitContactMessageAction({
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        subject: String(formData.get("subject") ?? ""),
        message: String(formData.get("message") ?? ""),
        companyWebsite: String(formData.get("companyWebsite") ?? ""),
      });

      if (!result.ok) {
        setError(result.error.message || copy.error);
        return;
      }

      setSuccess(true);
    });
  }

  if (success) {
    return (
      <div className="flex w-full justify-center md:justify-end">
        <p
          role="status"
          className="w-full max-w-md rounded-xl border border-green-200 bg-green-50 p-6 text-sm text-green-800"
        >
          {copy.success}
        </p>
      </div>
    );
  }

  return (
    <div className="flex w-full justify-center md:justify-end">
      <div className="w-full max-w-md border border-border bg-white p-6 shadow-sm sm:p-8">
        <form
          className="relative space-y-3"
          aria-label={copy.title}
          onSubmit={handleSubmit}
        >
          <ContactFormFields copy={copy} isPending={isPending} />
          {error ? (
            <p
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600"
            >
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            className="h-11 w-full rounded-full bg-marco-yellow text-sm font-semibold tracking-wide text-marco-black uppercase transition-[filter] hover:brightness-95 focus-visible:ring-2 focus-visible:ring-marco-yellow/50 disabled:opacity-50 sm:text-base"
            disabled={isPending}
          >
            {isPending ? copy.submitting : copy.submit}
          </button>
        </form>
      </div>
    </div>
  );
}
