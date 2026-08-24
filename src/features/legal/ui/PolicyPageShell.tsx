import type { ReactNode } from "react";

import { Card } from "@/components/ui/Card";
import {
  POLICY_CARD_CLASS,
  POLICY_DELIVERY_INNER_CLASS,
  POLICY_DELIVERY_PAGE_CLASS,
  POLICY_PAGE_WRAPPER_CLASS,
} from "@/features/legal/ui/policy-page.classes";

type PolicyPageShellProps = {
  children: ReactNode;
  /** Card-in-wrapper (privacy/terms/refund) vs title-above-card (delivery). */
  variant?: "card" | "delivery";
};

export function PolicyPageShell({
  children,
  variant = "card",
}: PolicyPageShellProps) {
  if (variant === "delivery") {
    return (
      <div className={POLICY_DELIVERY_PAGE_CLASS}>
        <div className={POLICY_DELIVERY_INNER_CLASS}>{children}</div>
      </div>
    );
  }

  return (
    <div className={POLICY_PAGE_WRAPPER_CLASS}>
      <Card className={POLICY_CARD_CLASS}>{children}</Card>
    </div>
  );
}
