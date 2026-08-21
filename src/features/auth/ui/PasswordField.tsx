"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import {
  AUTH_HINT_CLASS,
  AUTH_LABEL_CLASS,
  AUTH_PASSWORD_FIELD_CLASS,
  AUTH_PASSWORD_TOGGLE_CLASS,
} from "@/features/auth/ui/auth-form-classes";

type PasswordFieldProps = {
  name: string;
  label: string;
  showPasswordLabel: string;
  hidePasswordLabel: string;
  autoComplete: string;
  placeholder?: string;
  hint?: string;
};

export function PasswordField({
  name,
  label,
  showPasswordLabel,
  hidePasswordLabel,
  autoComplete,
  placeholder,
  hint,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label htmlFor={name} className={AUTH_LABEL_CLASS}>
        {label}
      </label>
      <div className="relative">
        <input
          id={name}
          required
          name={name}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className={AUTH_PASSWORD_FIELD_CLASS}
        />
        <button
          type="button"
          className={AUTH_PASSWORD_TOGGLE_CLASS}
          aria-label={visible ? hidePasswordLabel : showPasswordLabel}
          aria-pressed={visible}
          onClick={() => setVisible((current) => !current)}
        >
          {visible ? (
            <EyeOff className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Eye className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </div>
      {hint ? <p className={AUTH_HINT_CLASS}>{hint}</p> : null}
    </div>
  );
}
