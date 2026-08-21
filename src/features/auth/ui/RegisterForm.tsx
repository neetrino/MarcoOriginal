"use client";

import { useActionState } from "react";

import { AppLink } from "@/components/ui/AppLink";
import { type AuthActionState } from "@/features/auth/login-action";
import { registerAction } from "@/features/auth/register-action";
import { AuthTextField } from "@/features/auth/ui/AuthTextField";
import { PasswordField } from "@/features/auth/ui/PasswordField";
import {
  AUTH_CHECKBOX_CLASS,
  AUTH_ERROR_CLASS,
  AUTH_FOOTER_CLASS,
  AUTH_FORM_CLASS,
  AUTH_LINK_CLASS,
  AUTH_LINK_EMPHASIS_CLASS,
  AUTH_SUBMIT_CLASS,
} from "@/features/auth/ui/auth-form-classes";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

const initialState: AuthActionState = {};

type RegisterFormProps = {
  locale: Locale;
  dictionary: Dictionary["auth"];
};

function RegisterTermsField({ locale, dictionary }: RegisterFormProps) {
  return (
    <div className="flex items-start">
      <input
        id="terms"
        name="acceptTerms"
        type="checkbox"
        required
        className={AUTH_CHECKBOX_CLASS}
      />
      <label htmlFor="terms" className="ml-2 text-sm text-marco-slate/70">
        {dictionary.acceptTerms}{" "}
        <AppLink
          href={`/${locale}/legal/terms`}
          prefetchPolicy="intent"
          className={AUTH_LINK_CLASS}
        >
          {dictionary.termsOfService}
        </AppLink>{" "}
        {dictionary.and}{" "}
        <AppLink
          href={`/${locale}/legal/privacy`}
          prefetchPolicy="intent"
          className={AUTH_LINK_CLASS}
        >
          {dictionary.privacyPolicy}
        </AppLink>
      </label>
    </div>
  );
}

function RegisterFields({ locale, dictionary }: RegisterFormProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <AuthTextField
          name="firstName"
          label={dictionary.firstName}
          autoComplete="given-name"
          placeholder={dictionary.firstNamePlaceholder}
        />
        <AuthTextField
          name="lastName"
          label={dictionary.lastName}
          autoComplete="family-name"
          placeholder={dictionary.lastNamePlaceholder}
        />
      </div>
      <AuthTextField
        name="email"
        label={dictionary.email}
        type="email"
        autoComplete="email"
        placeholder={dictionary.emailPlaceholder}
      />
      <AuthTextField
        name="phone"
        label={dictionary.phone}
        type="tel"
        autoComplete="tel"
        placeholder={dictionary.phonePlaceholder}
      />
      <PasswordField
        name="password"
        label={dictionary.password}
        placeholder={dictionary.passwordPlaceholder}
        hint={dictionary.passwordHint}
        showPasswordLabel={dictionary.showPassword}
        hidePasswordLabel={dictionary.hidePassword}
        autoComplete="new-password"
      />
      <PasswordField
        name="confirmPassword"
        label={dictionary.confirmPassword}
        placeholder={dictionary.confirmPasswordPlaceholder}
        showPasswordLabel={dictionary.showPassword}
        hidePasswordLabel={dictionary.hidePassword}
        autoComplete="new-password"
      />
      <RegisterTermsField locale={locale} dictionary={dictionary} />
    </>
  );
}

export function RegisterForm({ locale, dictionary }: RegisterFormProps) {
  const action = registerAction.bind(null, locale);
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <>
      {state.error ? (
        <p role="alert" className={AUTH_ERROR_CLASS}>
          {state.error}
        </p>
      ) : null}
      <form action={formAction} className={AUTH_FORM_CLASS}>
        <RegisterFields locale={locale} dictionary={dictionary} />
        <button disabled={isPending} className={AUTH_SUBMIT_CLASS}>
          {isPending
            ? dictionary.submittingRegister
            : dictionary.submitRegister}
        </button>
      </form>
      <p className={AUTH_FOOTER_CLASS}>
        {dictionary.hasAccount}{" "}
        <AppLink
          href={`/${locale}/login`}
          prefetchPolicy="intent"
          className={AUTH_LINK_EMPHASIS_CLASS}
        >
          {dictionary.signInLink}
        </AppLink>
      </p>
    </>
  );
}
