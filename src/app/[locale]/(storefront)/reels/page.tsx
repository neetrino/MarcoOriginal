import { notFound } from "next/navigation";

import { listActiveStorefrontReels } from "@/features/reels/application/queries";
import { ReelsPageGrid } from "@/features/reels/ui/ReelsPageGrid";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

type ReelsPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: ReelsPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    return {};
  }

  return { title: getDictionary(locale).nav.reels };
}

export default async function ReelsPage({ params }: ReelsPageProps) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    notFound();
  }

  const dictionary = getDictionary(rawLocale);
  const reels = await listActiveStorefrontReels(rawLocale);

  if (reels.length === 0) {
    return (
      <section className="-mx-4 -my-10 bg-white px-4 pt-6 pb-24 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <h1 className="text-2xl font-semibold tracking-tight text-marco-slate">
          {dictionary.nav.reels}
        </h1>
        <p className="mt-3 text-sm text-gray-600">{dictionary.home.emptyReels}</p>
      </section>
    );
  }

  return (
    <section
      className="-mx-4 -my-10 min-h-[60vh] bg-white px-1 pt-1 pb-24 sm:-mx-6 sm:px-2 sm:pt-2 lg:-mx-8"
      aria-label={dictionary.nav.reels}
    >
      <ReelsPageGrid
        playLabel={dictionary.home.playReel}
        closeLabel={dictionary.home.closeReel}
        reels={reels.map((reel) => ({
          ...reel,
          title: reel.title || dictionary.home.untitledReel,
        }))}
      />
    </section>
  );
}
