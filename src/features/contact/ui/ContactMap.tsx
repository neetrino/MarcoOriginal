"use client";

import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";

import {
  mapsEmbedUrlForLocation,
  parseContactLocationHash,
  type ContactLocation,
  type ContactLocationId,
} from "@/features/contact/content/contact-locations";

type ContactMapAddressStripProps = {
  locations: readonly ContactLocation[];
  activeId: ContactLocationId;
  onSelect: (id: ContactLocationId) => void;
  sectionTitle: string;
};

function ContactMapAddressStrip({
  locations,
  activeId,
  onSelect,
  sectionTitle,
}: ContactMapAddressStripProps) {
  return (
    <div className="border-b border-border bg-white px-4 py-5 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <p className="mb-3 text-[11px] font-bold tracking-[0.08em] text-muted uppercase">
          {sectionTitle}
        </p>
        <div
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
          role="tablist"
          aria-label={sectionTitle}
        >
          {locations.map((location) => {
            const active = activeId === location.id;
            return (
              <button
                key={location.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onSelect(location.id)}
                className={`flex min-h-[3.25rem] items-start gap-2.5 rounded-2xl border px-4 py-3 text-left text-sm leading-snug font-medium transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marco-yellow/80 sm:text-[15px] ${
                  active
                    ? "border-marco-yellow bg-marco-yellow/12 text-foreground shadow-sm ring-1 ring-marco-yellow/35"
                    : "border-border bg-marco-gray/80 text-foreground hover:border-marco-yellow/45 hover:bg-marco-yellow/[0.06] hover:shadow-sm"
                }`}
              >
                <MapPin
                  className={`mt-0.5 h-[18px] w-[18px] shrink-0 stroke-[2] ${
                    active ? "text-marco-yellow" : "text-muted"
                  }`}
                  aria-hidden
                />
                <span className="min-w-0 flex-1">{location.address}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

type ContactMapProps = {
  locations: readonly ContactLocation[];
  sectionTitle: string;
};

export function ContactMap({ locations, sectionTitle }: ContactMapProps) {
  const fallbackId = locations[0]?.id ?? "yerevan";
  const [mapFocusId, setMapFocusId] = useState<ContactLocationId | null>(null);
  const activeMapId = mapFocusId ?? fallbackId;
  const mapLocation =
    locations.find((location) => location.id === activeMapId) ?? locations[0];

  useEffect(() => {
    const syncFromHash = () => {
      setMapFocusId(parseContactLocationHash(window.location.hash));
    };
    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  return (
    <div id="contact-page-map" className="w-full scroll-mt-24 bg-marco-gray">
      <ContactMapAddressStrip
        locations={locations}
        activeId={activeMapId}
        onSelect={(id) => {
          window.location.hash = `loc-${id}`;
        }}
        sectionTitle={sectionTitle}
      />
      <div className="h-[min(480px,62vh)] min-h-[300px] w-full">
        {mapLocation ? (
          <iframe
            key={mapLocation.id}
            title={mapLocation.address}
            src={mapsEmbedUrlForLocation(mapLocation)}
            width="100%"
            height="100%"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            className="h-full w-full border-0"
          />
        ) : null}
      </div>
    </div>
  );
}
