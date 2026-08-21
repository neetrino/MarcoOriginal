import {
  AUTH_FIELD_CLASS,
  AUTH_LABEL_CLASS,
} from "@/features/auth/ui/auth-form-classes";

type AuthTextFieldProps = {
  name: string;
  label: string;
  type?: "text" | "email" | "tel";
  autoComplete?: string;
  placeholder?: string;
  required?: boolean;
};

export function AuthTextField({
  name,
  label,
  type = "text",
  autoComplete,
  placeholder,
  required = true,
}: AuthTextFieldProps) {
  return (
    <div>
      <label htmlFor={name} className={AUTH_LABEL_CLASS}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        required={required}
        className={AUTH_FIELD_CLASS}
      />
    </div>
  );
}
