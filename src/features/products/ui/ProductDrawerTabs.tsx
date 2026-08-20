export const PRODUCT_DRAWER_TABS = [
  "basics",
  "description",
  "media",
  "catalog",
  "price",
] as const;

export type ProductDrawerTab = (typeof PRODUCT_DRAWER_TABS)[number];

type ProductDrawerTabsProps = {
  active: ProductDrawerTab;
  labels: Record<ProductDrawerTab, string>;
  onChange: (tab: ProductDrawerTab) => void;
};

export function ProductDrawerTabs({
  active,
  labels,
  onChange,
}: ProductDrawerTabsProps) {
  return (
    <nav
      aria-label={labels.basics}
      className="flex w-44 shrink-0 flex-col gap-1 border-r border-slate-100 p-4"
    >
      {PRODUCT_DRAWER_TABS.map((tab) => {
        const selected = tab === active;
        return (
          <button
            key={tab}
            type="button"
            onClick={() => onChange(tab)}
            className={`rounded-xl px-4 py-2.5 text-left text-sm font-medium transition-colors ${
              selected
                ? "bg-marco-yellow text-marco-slate"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
            }`}
          >
            {labels[tab]}
          </button>
        );
      })}
    </nav>
  );
}
