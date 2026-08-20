import { notFound } from "next/navigation";

import { listAdminBrands } from "@/features/brands/application/list-admin-brands";
import { AdminBrandsView } from "@/features/brands/ui/AdminBrandsView";
import { isLocale } from "@/lib/i18n/config";

type AdminBrandsPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminBrandsPage({
  params,
}: AdminBrandsPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  const brands = await listAdminBrands(locale);

  return <AdminBrandsView locale={locale} brands={brands} />;
}
