import "server-only";

import { and, desc, eq, isNull, sql } from "drizzle-orm";

import { getDb } from "@/db/client";
import { orders, users } from "@/db/schema";
import { formatDashboardUserName } from "@/features/admin/domain/dashboard-display";

const ACTIVITY_LIMIT = 5;

export type DashboardRegistration = {
  id: string;
  name: string;
  contact: string;
  registeredAt: Date;
};

export type DashboardActiveUser = {
  id: string;
  name: string;
  contact: string;
  orderCount: number;
  totalSpent: number;
};

export type DashboardUserActivity = {
  recentRegistrations: DashboardRegistration[];
  activeUsers: DashboardActiveUser[];
};

function userContact(
  email: string,
  phone: string | null,
  fallback: string,
): string {
  return email || phone || fallback;
}

/** Latest registrations and highest-order customers for the dashboard. */
export async function getDashboardUserActivity(): Promise<DashboardUserActivity> {
  const [recentRows, activeRows] = await Promise.all([
    getDb()
      .select({
        id: users.id,
        email: users.email,
        phone: users.phone,
        firstName: users.firstName,
        lastName: users.lastName,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(isNull(users.anonymizedAt))
      .orderBy(desc(users.createdAt))
      .limit(ACTIVITY_LIMIT),
    getDb()
      .select({
        id: users.id,
        email: users.email,
        phone: users.phone,
        firstName: users.firstName,
        lastName: users.lastName,
        orderCount: sql<number>`count(${orders.id})`.mapWith(Number),
        totalSpent: sql<number>`coalesce(sum(${orders.totalAmount}), 0)`.mapWith(
          Number,
        ),
      })
      .from(users)
      .innerJoin(orders, eq(orders.userId, users.id))
      .where(and(isNull(users.anonymizedAt), eq(orders.isArchived, false)))
      .groupBy(users.id)
      .orderBy(desc(sql`count(${orders.id})`))
      .limit(ACTIVITY_LIMIT),
  ]);

  return {
    recentRegistrations: recentRows.map((row) => ({
      id: row.id,
      name: formatDashboardUserName(row.firstName, row.lastName, row.email),
      contact: userContact(row.email, row.phone, row.email),
      registeredAt: row.createdAt,
    })),
    activeUsers: activeRows.map((row) => ({
      id: row.id,
      name: formatDashboardUserName(row.firstName, row.lastName, row.email),
      contact: userContact(row.email, row.phone, row.email),
      orderCount: row.orderCount,
      totalSpent: row.totalSpent,
    })),
  };
}
