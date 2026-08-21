import "server-only";

import { and, eq, gte, inArray, lte, sql } from "drizzle-orm";

import { getDb } from "@/db/client";
import { orders } from "@/db/schema";
import { ANALYTICS_TOP_CUSTOMERS_LIMIT } from "@/features/analytics/domain/analytics-display";
import type { OrderStatus } from "@/features/orders/domain/order-status";

export type AnalyticsNewVsRepeat = {
  newCustomers: number;
  repeatCustomers: number;
  ordersFromNewCustomers: number;
  ordersFromRepeatCustomers: number;
  ordersUnattributed: number;
};

export type AnalyticsTopCustomer = {
  identityType: "user" | "email";
  userId: string | null;
  email: string | null;
  displayName: string;
  totalSpend: number;
  orderCount: number;
};

export type AnalyticsCustomerBlock = {
  newVsRepeat: AnalyticsNewVsRepeat;
  topCustomersBySpend: AnalyticsTopCustomer[];
};

const IDENTITY_SQL = sql<string>`
  case
    when ${orders.userId} is not null then 'user:' || ${orders.userId}::text
    else 'email:' || lower(btrim(${orders.contactEmail}))
  end
`;

function toDate(value: Date | string): Date {
  return value instanceof Date ? value : new Date(value);
}

async function queryNewVsRepeat(
  start: Date,
  end: Date,
): Promise<AnalyticsNewVsRepeat> {
  const archived = eq(orders.isArchived, false);
  const [firstRows, periodRows] = await Promise.all([
    getDb()
      .select({
        identityKey: sql<string>`${IDENTITY_SQL}`,
        firstAt: sql<Date | string>`min(${orders.placedAt})`,
      })
      .from(orders)
      .where(archived)
      .groupBy(IDENTITY_SQL),
    getDb()
      .select({
        identityKey: sql<string>`${IDENTITY_SQL}`,
      })
      .from(orders)
      .where(
        and(archived, gte(orders.placedAt, start), lte(orders.placedAt, end)),
      ),
  ]);

  const firstAtByKey = new Map(
    firstRows.map((row) => [row.identityKey, toDate(row.firstAt)]),
  );
  const newIds = new Set<string>();
  const repeatIds = new Set<string>();
  let ordersFromNewCustomers = 0;
  let ordersFromRepeatCustomers = 0;

  for (const row of periodRows) {
    const firstAt = firstAtByKey.get(row.identityKey);
    if (!firstAt) continue;
    if (firstAt >= start && firstAt <= end) {
      newIds.add(row.identityKey);
      ordersFromNewCustomers += 1;
      continue;
    }
    if (firstAt < start) {
      repeatIds.add(row.identityKey);
      ordersFromRepeatCustomers += 1;
    }
  }

  return {
    newCustomers: newIds.size,
    repeatCustomers: repeatIds.size,
    ordersFromNewCustomers,
    ordersFromRepeatCustomers,
    ordersUnattributed: 0,
  };
}

function parseIdentity(identityKey: string): {
  identityType: "user" | "email";
  userId: string | null;
} {
  if (identityKey.startsWith("user:")) {
    return { identityType: "user", userId: identityKey.slice(5) };
  }
  return { identityType: "email", userId: null };
}

async function queryTopCustomers(
  start: Date,
  end: Date,
  revenueStatuses: OrderStatus[],
): Promise<AnalyticsTopCustomer[]> {
  const rows = await getDb()
    .select({
      identityKey: sql<string>`${IDENTITY_SQL}`,
      email: sql<string>`max(${orders.contactEmail})`,
      displayName: sql<string>`max(${orders.contactName})`,
      totalSpend: sql<number>`coalesce(sum(${orders.totalAmount}), 0)`.mapWith(
        Number,
      ),
      orderCount: sql<number>`count(*)`.mapWith(Number),
    })
    .from(orders)
    .where(
      and(
        eq(orders.isArchived, false),
        gte(orders.placedAt, start),
        lte(orders.placedAt, end),
        inArray(orders.status, revenueStatuses),
      ),
    )
    .groupBy(IDENTITY_SQL)
    .orderBy(sql`sum(${orders.totalAmount}) desc`)
    .limit(ANALYTICS_TOP_CUSTOMERS_LIMIT);

  return rows.map((row) => {
    const identity = parseIdentity(row.identityKey);
    return {
      ...identity,
      email: row.email,
      displayName: row.displayName || row.email,
      totalSpend: row.totalSpend,
      orderCount: row.orderCount,
    };
  });
}

/** New vs repeat customers and top spenders for the analytics window. */
export async function getCustomerAnalytics(input: {
  start: Date;
  end: Date;
  revenueStatuses: OrderStatus[];
}): Promise<AnalyticsCustomerBlock> {
  const [newVsRepeat, topCustomersBySpend] = await Promise.all([
    queryNewVsRepeat(input.start, input.end),
    queryTopCustomers(input.start, input.end, input.revenueStatuses),
  ]);

  return { newVsRepeat, topCustomersBySpend };
}
