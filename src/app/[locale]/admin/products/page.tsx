import { notFound } from "next/navigation";

import { listAdminBrands } from "@/features/brands/application/list-admin-brands";
import {
  listAdminCategoryOptions,
  listAdminProducts,
} from "@/features/products/application/list-admin-products";
import type { AdminProductsQueryState } from "@/features/products/domain/admin-products-query";
import { adminProductsFilterSchema } from "@/features/products/schemas/admin-list";
import { AdminProductsView } from "@/features/products/ui/AdminProductsView";
import { isLocale } from "@/lib/i18n/config";

type AdminProductsPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function firstParam(
  value: string | string[] | undefined,
): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}

const FALLBACK_FILTERS: AdminProductsQueryState = {
  page: 1,
  stock: "all",
  published: "all",
  sort: "created",
  dir: "desc",
  q: undefined,
  sku: undefined,
  categoryId: undefined,
};

export default async function AdminProductsPage({
  params,
  searchParams,
}: AdminProductsPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  const raw = await searchParams;
  const parsed = adminProductsFilterSchema.safeParse({
    q: firstParam(raw.q) || undefined,
    sku: firstParam(raw.sku) || undefined,
    categoryId: firstParam(raw.categoryId) || undefined,
    stock: firstParam(raw.stock) ?? "all",
    published: firstParam(raw.published) ?? "all",
    sort: firstParam(raw.sort) ?? "created",
    dir: firstParam(raw.dir) ?? "desc",
    page: firstParam(raw.page) ?? "1",
  });

  const filters = parsed.success ? parsed.data : FALLBACK_FILTERS;
  const [{ rows, total, pageSize }, categories, brands] = await Promise.all([
    listAdminProducts(locale, filters),
    listAdminCategoryOptions(locale),
    listAdminBrands(locale),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <section>
      <AdminProductsView
        locale={locale}
        products={rows}
        categories={categories}
        brands={brands}
        filters={filters}
        total={total}
        totalPages={totalPages}
      />
    </section>
  );
}
