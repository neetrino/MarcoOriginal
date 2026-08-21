"use client";

import { useActionState, useState } from "react";

import {
  updateProfileAction,
  type UpdateProfileActionState,
} from "@/features/auth/update-profile-action";
import {
  PROFILE_CARD_CLASS,
  PROFILE_FIELD_CLASS,
  PROFILE_LABEL_CLASS,
  PROFILE_OUTLINE_BUTTON_CLASS,
  PROFILE_PRIMARY_BUTTON_CLASS,
  PROFILE_SECTION_TITLE_CLASS,
} from "@/features/profile/ui/profile-surface-classes";

type PersonalInformationFormProps = {
  locale: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  labels: {
    title: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    cancel: string;
    save: string;
    saveShort: string;
    saving: string;
    firstNamePlaceholder: string;
    lastNamePlaceholder: string;
    emailPlaceholder: string;
    phonePlaceholder: string;
  };
};

type ProfileFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

const initialState: UpdateProfileActionState = {};

export function PersonalInformationForm({
  locale,
  firstName,
  lastName,
  email,
  phone,
  labels,
}: PersonalInformationFormProps) {
  const action = updateProfileAction.bind(null, locale);
  const [state, formAction, isPending] = useActionState(action, initialState);
  const savedValues: ProfileFormValues = {
    firstName,
    lastName,
    email,
    phone,
  };
  const [values, setValues] = useState(savedValues);
  const [prevSaved, setPrevSaved] = useState(savedValues);

  if (
    firstName !== prevSaved.firstName ||
    lastName !== prevSaved.lastName ||
    email !== prevSaved.email ||
    phone !== prevSaved.phone
  ) {
    setPrevSaved(savedValues);
    setValues(savedValues);
  }

  function resetToSaved(): void {
    setValues({ firstName, lastName, email, phone });
  }

  return (
    <section className={PROFILE_CARD_CLASS}>
      <h1 className={`${PROFILE_SECTION_TITLE_CLASS} mb-6 text-center`}>
        {labels.title}
      </h1>

      <form action={formAction} className="mx-auto max-w-xl space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className={PROFILE_LABEL_CLASS}>
            {labels.firstName}
            <input
              name="firstName"
              required
              value={values.firstName}
              onChange={(event) =>
                setValues((prev) => ({
                  ...prev,
                  firstName: event.target.value,
                }))
              }
              placeholder={labels.firstNamePlaceholder}
              className={PROFILE_FIELD_CLASS}
              autoComplete="given-name"
            />
          </label>
          <label className={PROFILE_LABEL_CLASS}>
            {labels.lastName}
            <input
              name="lastName"
              required
              value={values.lastName}
              onChange={(event) =>
                setValues((prev) => ({
                  ...prev,
                  lastName: event.target.value,
                }))
              }
              placeholder={labels.lastNamePlaceholder}
              className={PROFILE_FIELD_CLASS}
              autoComplete="family-name"
            />
          </label>
        </div>

        <label className={PROFILE_LABEL_CLASS}>
          {labels.email}
          <input
            name="email"
            type="email"
            required
            value={values.email}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, email: event.target.value }))
            }
            placeholder={labels.emailPlaceholder}
            className={PROFILE_FIELD_CLASS}
            autoComplete="email"
          />
        </label>
        <label className={PROFILE_LABEL_CLASS}>
          {labels.phone}
          <input
            name="phone"
            type="tel"
            required
            value={values.phone}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, phone: event.target.value }))
            }
            placeholder={labels.phonePlaceholder}
            className={PROFILE_FIELD_CLASS}
            autoComplete="tel"
          />
        </label>

        {state.error ? (
          <p className="text-sm text-red-700" role="alert">
            {state.error}
          </p>
        ) : null}
        {state.success ? (
          <p className="text-sm text-green-700" role="status">
            {state.success}
          </p>
        ) : null}

        <div className="flex flex-nowrap items-center justify-center gap-2 pt-4">
          <button
            type="submit"
            className={PROFILE_PRIMARY_BUTTON_CLASS}
            disabled={isPending}
          >
            {isPending ? (
              labels.saving
            ) : (
              <>
                <span className="sm:hidden">{labels.saveShort}</span>
                <span className="hidden sm:inline">{labels.save}</span>
              </>
            )}
          </button>
          <button
            type="button"
            className={PROFILE_OUTLINE_BUTTON_CLASS}
            onClick={resetToSaved}
            disabled={isPending}
          >
            {labels.cancel}
          </button>
        </div>
      </form>
    </section>
  );
}
