import type { ComparePageView } from "@/features/compare/types";
import { CompareTable } from "@/features/compare/ui/CompareTable";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

type CompareViewProps = {
  view: ComparePageView;
  labels: Dictionary["compare"];
};

export function CompareView({ view, labels }: CompareViewProps) {
  const heading = view.heading ?? labels.title;

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-end justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight text-marco-slate">
          {heading}
        </h1>
        {view.count > 0 ? (
          <p className="text-sm text-gray-400 tabular-nums">
            {view.count}/{view.max}
          </p>
        ) : null}
      </div>
      {view.products.length === 0 ? (
        <p className="rounded-3xl bg-gray-50 px-6 py-16 text-center text-marco-slate">
          {labels.empty}
        </p>
      ) : (
        <CompareTable products={view.products} labels={labels} />
      )}
    </section>
  );
}
