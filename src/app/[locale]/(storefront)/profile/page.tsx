import { Clock3, MapPin, Package, Wallet } from "lucide-react";
import { notFound } from "next/navigation";

import { getProfileDashboard } from "@/features/profile/application/dashboard-queries";
import { ProfileDashboardOrdersSection } from "@/features/profile/ui/ProfileDashboardOrdersSection";
import { ProfileDashboardQuickActions } from "@/features/profile/ui/ProfileDashboardQuickActions";
import { ProfileStatCard } from "@/features/profile/ui/ProfileStatCard";
import { requireUser } from "@/lib/auth/policies";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { formatMoneyAmount } from "@/lib/money/format";

type ProfilePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  const user = await requireUser(locale);
  const dictionary = getDictionary(locale);
  const { stats, recentOrders } = await getProfileDashboard(user.id);
  const copy = dictionary.profile;

  return (
    <section className="profile-sheet-keep-frame space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
        <ProfileStatCard
          label={copy.totalOrders}
          value={String(stats.totalOrders)}
          icon={<Package aria-hidden />}
          tone="blue"
        />
        <ProfileStatCard
          label={copy.totalSpent}
          value={formatMoneyAmount(stats.totalSpent, "AMD", locale)}
          icon={<Wallet aria-hidden />}
          tone="green"
        />
        <ProfileStatCard
          label={copy.pendingOrders}
          value={String(stats.pendingOrders)}
          icon={<Clock3 aria-hidden />}
          tone="yellow"
        />
        <ProfileStatCard
          label={copy.savedAddresses}
          value={String(stats.addressesCount)}
          icon={<MapPin aria-hidden />}
          tone="purple"
        />
      </div>

      <ProfileDashboardOrdersSection
        locale={locale}
        orders={recentOrders}
        labels={{
          recentOrders: copy.recentOrders,
          viewAllOrders: copy.viewAll,
          noOrders: copy.noOrders,
          startShopping: copy.startShopping,
          orderNumber: copy.orderNumber,
          viewDetails: copy.viewDetails,
          placedOn: copy.placedOn,
          item: copy.item,
          items: copy.items,
          status: copy.status,
        }}
      />

      <ProfileDashboardQuickActions
        locale={locale}
        labels={{
          quickActions: copy.quickActions,
          viewAllOrders: copy.viewAllOrders,
          manageAddresses: copy.manageAddresses,
          continueShopping: copy.continueShopping,
        }}
      />
    </section>
  );
}
