import type { ContactLocation } from "@/features/contact/content/contact-locations";
import { StoreCard } from "@/features/stores/ui/StoreCard";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

type StoresGridProps = {
  locations: readonly ContactLocation[];
  copy: Dictionary["stores"];
};

export function StoresGrid({ locations, copy }: StoresGridProps) {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {locations.map((location) => (
        <StoreCard key={location.id} location={location} copy={copy} />
      ))}
    </div>
  );
}
