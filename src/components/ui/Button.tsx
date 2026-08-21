import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
};

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary:
    "bg-marco-slate text-white hover:brightness-95 focus:ring-marco-slate",
  secondary:
    "border border-gray-300 bg-white text-marco-slate hover:bg-marco-gray focus:ring-marco-slate/40",
  outline:
    "border border-gray-300 bg-transparent text-marco-slate hover:bg-marco-gray focus:ring-marco-slate/40",
  ghost:
    "bg-transparent text-marco-slate hover:bg-marco-gray focus:ring-marco-slate/40",
  danger:
    "bg-red-600 text-white hover:bg-red-700 focus:ring-red-600",
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`cursor-pointer rounded-full font-medium transition-[color,background-color,filter] focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${VARIANT_STYLES[variant]} ${SIZE_STYLES[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
