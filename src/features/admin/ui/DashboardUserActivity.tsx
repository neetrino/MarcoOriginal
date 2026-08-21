import type { ReactNode } from "react";

import { Card } from "@/components/ui/Card";
import type { DashboardUserActivity as Activity } from "@/features/admin/application/dashboard-user-activity";
import {
  formatDashboardDate,
  getDashboardInitials,
} from "@/features/admin/domain/dashboard-display";
import { DASHBOARD_ACTIVITY_CARD_CLASS } from "@/features/admin/ui/dashboard-card-classes";
import {
  formatAdminMessage,
  getAdminCopy,
} from "@/features/admin/ui/get-admin-copy";

type DashboardUserActivityProps = {
  locale: string;
  activity: Activity;
  formatAmount: (amount: number) => string;
};

function ActivityHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-4 flex items-start justify-between">
      <div>
        <h3 className="text-lg font-semibold text-marco-ink">{title}</h3>
        <p className="mt-1 text-xs text-marco-slate/60">{subtitle}</p>
      </div>
      <span className="h-2.5 w-2.5 rounded-full bg-marco-yellow shadow-[0_0_0_4px_rgba(247,206,63,0.24)]" />
    </div>
  );
}

function ActivityRow({
  name,
  contact,
  trailing,
}: {
  name: string;
  contact: string;
  trailing: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white/85 p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-marco-yellow/60 hover:bg-marco-yellow/10">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-marco-yellow/30 text-xs font-bold text-marco-ink">
            {getDashboardInitials(name)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-marco-ink">
              {name}
            </p>
            <p className="truncate text-xs text-marco-slate/70">{contact}</p>
          </div>
        </div>
        {trailing}
      </div>
    </div>
  );
}

function ActivityColumn({
  title,
  subtitle,
  empty,
  children,
}: {
  title: string;
  subtitle: string;
  empty: string | null;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white/75 p-4 shadow-sm">
      <ActivityHeader title={title} subtitle={subtitle} />
      <div className="space-y-3">
        {empty ? (
          <p className="rounded-xl border border-dashed border-gray-200 bg-white/70 px-4 py-6 text-center text-sm text-marco-slate/65">
            {empty}
          </p>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

export function DashboardUserActivity({
  locale,
  activity,
  formatAmount,
}: DashboardUserActivityProps) {
  const copy = getAdminCopy(locale).dashboard;

  return (
    <Card className={DASHBOARD_ACTIVITY_CARD_CLASS}>
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-marco-yellow/20 blur-3xl" />
      <div className="relative mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-marco-ink">
          {copy.userActivity}
        </h2>
        <span className="rounded-full border border-gray-200 bg-white/80 px-3 py-1 text-xs font-medium text-marco-slate/65">
          {copy.recentRegistrations} & {copy.mostActiveUsers}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <ActivityColumn
          title={copy.recentRegistrations}
          subtitle={copy.userActivity}
          empty={
            activity.recentRegistrations.length === 0
              ? copy.noRecentRegistrations
              : null
          }
        >
          {activity.recentRegistrations.map((user) => (
            <ActivityRow
              key={user.id}
              name={user.name}
              contact={user.contact}
              trailing={
                <span className="rounded-full bg-marco-gray px-2 py-1 text-[11px] font-medium text-marco-slate/65">
                  {formatDashboardDate(user.registeredAt, locale)}
                </span>
              }
            />
          ))}
        </ActivityColumn>
        <ActivityColumn
          title={copy.mostActiveUsers}
          subtitle={formatAdminMessage(copy.ordersCount, {
            count: activity.activeUsers.length,
          })}
          empty={
            activity.activeUsers.length === 0 ? copy.noActiveUsers : null
          }
        >
          {activity.activeUsers.map((user) => (
            <ActivityRow
              key={user.id}
              name={user.name}
              contact={user.contact}
              trailing={
                <div className="text-right">
                  <p className="text-xs font-semibold text-marco-ink">
                    {formatAmount(user.totalSpent)}
                  </p>
                  <p className="text-[11px] text-marco-slate/60">
                    {formatAdminMessage(copy.ordersCount, {
                      count: user.orderCount,
                    })}
                  </p>
                </div>
              }
            />
          ))}
        </ActivityColumn>
      </div>
    </Card>
  );
}
