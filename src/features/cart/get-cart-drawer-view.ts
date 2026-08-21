import "server-only";

import { and, asc, eq, inArray, or } from "drizzle-orm";

import { getCartWithItems } from "@/features/cart/cart";
import { getDb } from "@/db/client";
import { mediaAssets } from "@/db/schema";
import { resolveProductPrices } from "@/features/promotions/application/resolve-product-prices";
import type { Locale } from "@/lib/i18n/config";
import { getCheckoutRateSnapshot } from "@/lib/fx/service";
import { mediaPublicUrl } from "@/lib/media/public-url";
import { convertAmount } from "@/lib/money/convert";
import type { Currency } from "@/lib/money/currency";
import { defaultCurrency } from "@/lib/money/currency";
import { formatMoneyAmount, formatMoneyWithSymbol } from "@/lib/money/format";

export type CartDrawerItemView = {
  id: string;
  title: string;
  quantity: number;
  imageUrl: string | null;
  productHref: string | null;
  unitPriceFormatted: string;
  lineTotalFormatted: string;
};

export type CartDrawerView = {
  itemCount: number;
  items: CartDrawerItemView[];
  subtotalFormatted: string;
  shippingFormatted: string;
  totalFormatted: string;
  headerTotalFormatted: string;
};

export type CartHeaderSummary = {
  itemCount: number;
  totalFormatted: string;
};

async function loadPrimaryProductImages(
  productIds: string[],
): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  if (productIds.length === 0) {
    return map;
  }

  const rows = await getDb()
    .select({
      productId: mediaAssets.productId,
      objectKey: mediaAssets.objectKey,
    })
    .from(mediaAssets)
    .where(
      and(
        inArray(mediaAssets.productId, productIds),
        eq(mediaAssets.uploadStatus, "READY"),
        or(eq(mediaAssets.isPrimary, true), eq(mediaAssets.role, "PRIMARY")),
      ),
    )
    .orderBy(asc(mediaAssets.sortOrder));

  for (const row of rows) {
    if (!row.productId || map.has(row.productId)) {
      continue;
    }
    map.set(row.productId, mediaPublicUrl(row.objectKey));
  }

  return map;
}

function convertedMinorAmount(
  baseAmountAmd: number,
  rate: string,
  currency: Currency,
) {
  return convertAmount(
    baseAmountAmd,
    rate,
    defaultCurrency,
    currency,
  ).amount;
}

function formatConvertedAmount(
  baseAmountAmd: number,
  rate: string,
  currency: Currency,
  locale: Locale,
): string {
  return formatMoneyAmount(
    convertedMinorAmount(baseAmountAmd, rate, currency),
    currency,
    locale,
  );
}

function formatConvertedAmountWithSymbol(
  baseAmountAmd: number,
  rate: string,
  currency: Currency,
  locale: Locale,
): string {
  return formatMoneyWithSymbol(
    convertedMinorAmount(baseAmountAmd, rate, currency),
    currency,
    locale,
  );
}

/** Header cart pill — item count + total with currency glyph, no image work. */
export async function getCartHeaderSummary(
  locale: Locale,
  currency: Currency,
): Promise<CartHeaderSummary> {
  const { items: rows } = await getCartWithItems();
  if (rows.length === 0) {
    return {
      itemCount: 0,
      totalFormatted: formatMoneyWithSymbol(0, currency, locale),
    };
  }

  const [quote, prices] = await Promise.all([
    getCheckoutRateSnapshot(currency),
    resolveProductPrices(
      rows.map(({ product }) => ({
        id: product.id,
        priceAmount: product.priceAmount,
        compareAtAmount: product.compareAtAmount,
      })),
    ),
  ]);

  let subtotalBase = 0;
  let itemCount = 0;
  for (const { item, product } of rows) {
    const unitAmount =
      prices.get(product.id)?.unitAmount ?? product.priceAmount;
    subtotalBase += item.quantity * unitAmount;
    itemCount += item.quantity;
  }

  return {
    itemCount,
    totalFormatted: formatConvertedAmountWithSymbol(
      subtotalBase,
      quote.rate,
      currency,
      locale,
    ),
  };
}

/** Builds storefront cart-drawer display data for the active cart. */
export async function getCartDrawerView(
  locale: Locale,
  currency: Currency,
): Promise<CartDrawerView> {
  const { items: rows } = await getCartWithItems();
  const [images, quote, prices] = await Promise.all([
    loadPrimaryProductImages(rows.map(({ product }) => product.id)),
    getCheckoutRateSnapshot(currency),
    resolveProductPrices(
      rows.map(({ product }) => ({
        id: product.id,
        priceAmount: product.priceAmount,
        compareAtAmount: product.compareAtAmount,
      })),
    ),
  ]);

  const items: CartDrawerItemView[] = [];
  let subtotalBase = 0;

  for (const { item, product } of rows) {
    const translation =
      product.translations[locale] ?? product.translations.hy;
    const unitAmount =
      prices.get(product.id)?.unitAmount ?? product.priceAmount;

    items.push({
      id: item.id,
      title: translation?.title ?? product.sku,
      quantity: item.quantity,
      imageUrl: images.get(product.id) ?? null,
      productHref: translation?.slug
        ? `/${locale}/products/${translation.slug}`
        : null,
      unitPriceFormatted: formatConvertedAmount(
        unitAmount,
        quote.rate,
        currency,
        locale,
      ),
      lineTotalFormatted: formatConvertedAmount(
        unitAmount * item.quantity,
        quote.rate,
        currency,
        locale,
      ),
    });
    subtotalBase += item.quantity * unitAmount;
  }

  const subtotalFormatted = formatConvertedAmount(
    subtotalBase,
    quote.rate,
    currency,
    locale,
  );

  return {
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    items,
    subtotalFormatted,
    shippingFormatted: formatMoneyAmount(0, currency, locale),
    totalFormatted: subtotalFormatted,
    headerTotalFormatted: formatConvertedAmountWithSymbol(
      subtotalBase,
      quote.rate,
      currency,
      locale,
    ),
  };
}
