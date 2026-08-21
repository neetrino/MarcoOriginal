"use client";

import { useActionState, useState } from "react";

import {
  deleteAccountAction,
  type DeleteAccountActionState,
} from "@/features/auth/delete-account-action";
import {
  PROFILE_CARD_CLASS,
  PROFILE_DANGER_BUTTON_CLASS,
  PROFILE_FIELD_CLASS,
  PROFILE_LABEL_CLASS,
  PROFILE_SECTION_TITLE_CLASS,
} from "@/features/profile/ui/profile-surface-classes";

type DeleteAccountFormProps = {
  locale: string;
  labels: {
    title: string;
    description: string;
    pointOrders: string;
    pointLogin: string;
    pointData: string;
    currentPassword: string;
    currentPasswordPlaceholder: string;
    acknowledge: string;
    submit: string;
    deleting: string;
  };
};

const initialState: DeleteAccountActionState = {};

export function DeleteAccountForm({ locale, labels }: DeleteAccountFormProps) {
  const action = deleteAccountAction.bind(null, locale);
  const [state, formAction, isPending] = useActionState(action, initialState);
  const [password, setPassword] = useState("");
  const [acknowledged, setAcknowledged] = useState(false);

  return (
    <section className={`${PROFILE_CARD_CLASS} border-red-200`}>
      <h1 className={`${PROFILE_SECTION_TITLE_CLASS} mb-2 text-center`}>
        {labels.title}
      </h1>
      <p className="mb-4 text-center text-sm text-marco-slate/70">
        {labels.description}
      </p>

      <ul className="mb-6 list-disc space-y-1 pl-5 text-sm text-marco-slate">
        <li>{labels.pointOrders}</li>
        <li>{labels.pointLogin}</li>
        <li>{labels.pointData}</li>
      </ul>

      <form action={formAction} className="mx-auto max-w-xl space-y-6">
        <label className={PROFILE_LABEL_CLASS}>
          {labels.currentPassword}
          <input
            name="password"
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder={labels.currentPasswordPlaceholder}
            className={PROFILE_FIELD_CLASS}
            autoComplete="current-password"
          />
        </label>

        <label className="flex cursor-pointer items-start gap-3 text-sm text-marco-slate">
          <input
            name="acknowledged"
            type="checkbox"
            value="on"
            className="mt-1 h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
            checked={acknowledged}
            onChange={(event) => setAcknowledged(event.target.checked)}
          />
          <span>{labels.acknowledge}</span>
        </label>

        {state.error ? (
          <p className="text-sm text-red-700" role="alert">
            {state.error}
          </p>
        ) : null}

        <div className="flex justify-center">
          <button
            type="submit"
            className={PROFILE_DANGER_BUTTON_CLASS}
            disabled={isPending || !acknowledged}
          >
            {isPending ? labels.deleting : labels.submit}
          </button>
        </div>
      </form>
    </section>
  );
}
