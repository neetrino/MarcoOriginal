import { notFound } from "next/navigation";

import {
  getAdminReelsStats,
  listAdminReels,
} from "@/features/reels/application/queries";
import { AdminReelsView } from "@/features/reels/ui/AdminReelsView";
import { isLocale } from "@/lib/i18n/config";

type AdminReelsPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminReelsPage({ params }: AdminReelsPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  const [reels, stats] = await Promise.all([
    listAdminReels(locale),
    getAdminReelsStats(),
  ]);

  return <AdminReelsView locale={locale} reels={reels} stats={stats} />;
}
