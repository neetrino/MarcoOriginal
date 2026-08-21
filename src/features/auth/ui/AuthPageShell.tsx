import type { ReactNode } from "react";

import {
  AUTH_CARD_CLASS,
  AUTH_PAGE_CLASS,
  AUTH_SUBTITLE_CLASS,
  AUTH_TITLE_CLASS,
} from "@/features/auth/ui/auth-form-classes";

type AuthPageShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

export function AuthPageShell({
  title,
  subtitle,
  children,
}: AuthPageShellProps) {
  return (
    <section className={AUTH_PAGE_CLASS}>
      <div className={AUTH_CARD_CLASS}>
        <h1 className={AUTH_TITLE_CLASS}>{title}</h1>
        <p className={AUTH_SUBTITLE_CLASS}>{subtitle}</p>
        {children}
      </div>
    </section>
  );
}
