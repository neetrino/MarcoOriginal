"use client";

import { useActionState, useState } from "react";

import {
  changePasswordAction,
  type ChangePasswordActionState,
} from "@/features/auth/change-password-action";
import {
  PROFILE_CARD_CLASS,
  PROFILE_FIELD_CLASS,
  PROFILE_LABEL_CLASS,
  PROFILE_PRIMARY_BUTTON_CLASS,
  PROFILE_SECTION_TITLE_CLASS,
} from "@/features/profile/ui/profile-surface-classes";

type ChangePasswordFormProps = {
  locale: string;
  labels: {
    title: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
    currentPasswordPlaceholder: string;
    newPasswordPlaceholder: string;
    confirmPasswordPlaceholder: string;
    change: string;
    changeShort: string;
    changing: string;
  };
};

const emptyForm = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const initialState: ChangePasswordActionState = {};

export function ChangePasswordForm({ locale, labels }: ChangePasswordFormProps) {
  const action = changePasswordAction.bind(null, locale);
  const [state, formAction, isPending] = useActionState(action, initialState);
  const [values, setValues] = useState(emptyForm);
  const [prevSuccess, setPrevSuccess] = useState(state.success);

  if (state.success !== prevSuccess) {
    setPrevSuccess(state.success);
    if (state.success) {
      setValues(emptyForm);
    }
  }

  return (
    <section className={PROFILE_CARD_CLASS}>
      <h1 className={`${PROFILE_SECTION_TITLE_CLASS} mb-6 text-center`}>
        {labels.title}
      </h1>

      <form action={formAction} className="mx-auto max-w-xl space-y-4">
        <label className={PROFILE_LABEL_CLASS}>
          {labels.currentPassword}
          <input
            name="currentPassword"
            type="password"
            required
            value={values.currentPassword}
            onChange={(event) =>
              setValues((prev) => ({
                ...prev,
                currentPassword: event.target.value,
              }))
            }
            placeholder={labels.currentPasswordPlaceholder}
            className={PROFILE_FIELD_CLASS}
            autoComplete="current-password"
          />
        </label>

        <label className={PROFILE_LABEL_CLASS}>
          {labels.newPassword}
          <input
            name="newPassword"
            type="password"
            required
            value={values.newPassword}
            onChange={(event) =>
              setValues((prev) => ({
                ...prev,
                newPassword: event.target.value,
              }))
            }
            placeholder={labels.newPasswordPlaceholder}
            className={PROFILE_FIELD_CLASS}
            autoComplete="new-password"
          />
        </label>

        <label className={PROFILE_LABEL_CLASS}>
          {labels.confirmPassword}
          <input
            name="confirmPassword"
            type="password"
            required
            value={values.confirmPassword}
            onChange={(event) =>
              setValues((prev) => ({
                ...prev,
                confirmPassword: event.target.value,
              }))
            }
            placeholder={labels.confirmPasswordPlaceholder}
            className={PROFILE_FIELD_CLASS}
            autoComplete="new-password"
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

        <div className="flex justify-center pt-4">
          <button
            type="submit"
            className={PROFILE_PRIMARY_BUTTON_CLASS}
            disabled={isPending}
          >
            {isPending ? (
              labels.changing
            ) : (
              <>
                <span className="sm:hidden">{labels.changeShort}</span>
                <span className="hidden sm:inline">{labels.change}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}
