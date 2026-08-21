import { MapPin, Package, ShoppingBag } from "lucide-react";

import { AppLink } from "@/components/ui/AppLink";
import {
  PROFILE_CARD_CLASS,
  PROFILE_QUICK_ACTION_BUTTON_CLASS,
  PROFILE_SECTION_TITLE_CLASS,
} from "@/features/profile/ui/profile-surface-classes";

type ProfileDashboardQuickActionsProps = {
  locale: string;
  labels: {
    quickActions: string;
    viewAllOrders: string;
    manageAddresses: string;
    continueShopping: string;
  };
};

export function ProfileDashboardQuickActions({
  locale,
  labels,
}: ProfileDashboardQuickActionsProps) {
  return (
    <section className={PROFILE_CARD_CLASS}>
      <h2 className={`${PROFILE_SECTION_TITLE_CLASS} mb-4`}>
        {labels.quickActions}
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <AppLink
          href={`/${locale}/profile/orders`}
          prefetchPolicy="intent"
          className={PROFILE_QUICK_ACTION_BUTTON_CLASS}
        >
          <span className="inline-flex items-center gap-2 whitespace-nowrap">
            <Package className="h-5 w-5 shrink-0" aria-hidden />
            {labels.viewAllOrders}
          </span>
        </AppLink>
        <AppLink
          href={`/${locale}/profile/addresses`}
          prefetchPolicy="intent"
          className={PROFILE_QUICK_ACTION_BUTTON_CLASS}
        >
          <span className="inline-flex items-center gap-2 whitespace-nowrap">
            <MapPin className="h-5 w-5 shrink-0" aria-hidden />
            {labels.manageAddresses}
          </span>
        </AppLink>
        <AppLink
          href={`/${locale}/products`}
          prefetchPolicy="intent"
          className={PROFILE_QUICK_ACTION_BUTTON_CLASS}
        >
          <span className="inline-flex items-center gap-2 whitespace-nowrap">
            <ShoppingBag className="h-5 w-5 shrink-0" aria-hidden />
            {labels.continueShopping}
          </span>
        </AppLink>
      </div>
    </section>
  );
}
