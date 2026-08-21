"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { ChevronDown, MapPin, Phone } from "lucide-react";

import { AppLink } from "@/components/ui/AppLink";
import {
  contactLocationMapHref,
  phoneToTelHref,
  type ContactLocation,
  type ContactPhoneSection,
} from "@/features/contact/content/contact-locations";
import type { Locale } from "@/lib/i18n/config";

const DROPDOWN_PANEL_CLASS =
  "absolute right-0 top-full z-[500] mt-2 max-h-[min(24rem,70vh)] w-[min(20rem,calc(100vw-2rem))] overflow-y-auto overflow-x-hidden rounded-xl border border-gray-200/90 bg-white py-2 shadow-xl";

const TRIGGER_CLASS =
  "flex h-10 shrink-0 items-center gap-2 text-marco-slate transition-opacity hover:opacity-90";

type OpenMenu = "phone" | "address" | null;

type HeaderContactClusterProps = {
  locale: Locale;
  phoneDisplay: string;
  phoneSections: readonly ContactPhoneSection[];
  locations: readonly ContactLocation[];
  addressesLabel: string;
  storesLabel: string;
  openInMapsLabel: string;
  choosePhoneLabel: string;
  chooseAddressLabel: string;
};

function PickerChevron({ open }: { open: boolean }) {
  return (
    <ChevronDown
      className={`h-3 w-3 shrink-0 opacity-80 transition-transform ${open ? "rotate-180" : ""}`}
      strokeWidth={2.25}
      aria-hidden
    />
  );
}

function PhonePicker({
  pickerRef,
  open,
  onToggle,
  phoneDisplay,
  phoneSections,
  choosePhoneLabel,
}: {
  pickerRef: RefObject<HTMLDivElement | null>;
  open: boolean;
  onToggle: () => void;
  phoneDisplay: string;
  phoneSections: readonly ContactPhoneSection[];
  choosePhoneLabel: string;
}) {
  return (
    <div ref={pickerRef} className="relative shrink-0">
      <button
        type="button"
        className={TRIGGER_CLASS}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={choosePhoneLabel}
        onClick={onToggle}
      >
        <Phone className="size-[19px] shrink-0" strokeWidth={1.75} aria-hidden />
        <span className="inline-flex items-center gap-1">
          <span className="whitespace-nowrap text-[13px] font-medium leading-[13px]">
            {phoneDisplay}
          </span>
          <PickerChevron open={open} />
        </span>
      </button>
      {open ? (
        <div className={DROPDOWN_PANEL_CLASS} role="menu" aria-label={choosePhoneLabel}>
          {phoneSections.map((section, index) => (
            <div
              key={section.id}
              className={`px-3 py-2 ${index > 0 ? "border-t border-gray-100 pt-3" : ""}`}
            >
              <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-marco-slate/70">
                {section.label}
              </p>
              <ul className="flex flex-col gap-0.5">
                {section.phones.map((phone) => (
                  <li key={`${section.id}-${phone}`}>
                    <a
                      role="menuitem"
                      href={phoneToTelHref(phone)}
                      className="block rounded-md px-2 py-1.5 text-[13px] font-medium text-marco-slate hover:bg-marco-gray/80"
                    >
                      {phone}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function AddressPicker({
  pickerRef,
  open,
  onToggle,
  locale,
  locations,
  addressesLabel,
  storesLabel,
  openInMapsLabel,
  chooseAddressLabel,
}: {
  pickerRef: RefObject<HTMLDivElement | null>;
  open: boolean;
  onToggle: () => void;
  locale: Locale;
  locations: readonly ContactLocation[];
  addressesLabel: string;
  storesLabel: string;
  openInMapsLabel: string;
  chooseAddressLabel: string;
}) {
  return (
    <div ref={pickerRef} className="relative shrink-0">
      <button
        type="button"
        className={TRIGGER_CLASS}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={chooseAddressLabel}
        onClick={onToggle}
      >
        <MapPin className="size-[19px] shrink-0" strokeWidth={1.75} aria-hidden />
        <span className="inline-flex items-center gap-1">
          <span className="whitespace-nowrap text-xs font-medium leading-[13px]">
            {addressesLabel}
          </span>
          <PickerChevron open={open} />
        </span>
      </button>
      {open ? (
        <div className={DROPDOWN_PANEL_CLASS} role="menu" aria-label={chooseAddressLabel}>
          <ul className="flex flex-col gap-0.5 px-2 pb-1">
            {locations.map((location) => (
              <li key={location.id}>
                <AppLink
                  role="menuitem"
                  href={contactLocationMapHref(locale, location.id)}
                  prefetchPolicy="intent"
                  aria-label={openInMapsLabel}
                  className="mx-1 mb-1 mt-1 block rounded-md px-2 py-2 text-left text-xs font-medium leading-snug text-marco-slate no-underline hover:bg-marco-gray/80"
                >
                  {location.address}
                </AppLink>
              </li>
            ))}
          </ul>
          <div className="border-t border-gray-100 px-2 py-2">
            <AppLink
              href={`/${locale}/stores`}
              role="menuitem"
              prefetchPolicy="intent"
              className="block rounded-md px-2 py-1.5 text-center text-xs font-bold uppercase tracking-wide text-marco-slate hover:bg-marco-gray/80"
            >
              {storesLabel}
            </AppLink>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function HeaderContactCluster({
  locale,
  phoneDisplay,
  phoneSections,
  locations,
  addressesLabel,
  storesLabel,
  openInMapsLabel,
  choosePhoneLabel,
  chooseAddressLabel,
}: HeaderContactClusterProps) {
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const addressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!openMenu) return;

    function onDocMouse(event: MouseEvent): void {
      const node = event.target;
      if (!(node instanceof Node)) return;
      if (phoneRef.current?.contains(node) || addressRef.current?.contains(node)) {
        return;
      }
      setOpenMenu(null);
    }

    function onKey(event: KeyboardEvent): void {
      if (event.key === "Escape") setOpenMenu(null);
    }

    document.addEventListener("mousedown", onDocMouse);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocMouse);
      document.removeEventListener("keydown", onKey);
    };
  }, [openMenu]);

  return (
    <div className="flex h-10 min-w-0 shrink-0 flex-nowrap items-center gap-x-[29px]">
      <PhonePicker
        pickerRef={phoneRef}
        open={openMenu === "phone"}
        onToggle={() => setOpenMenu((menu) => (menu === "phone" ? null : "phone"))}
        phoneDisplay={phoneDisplay}
        phoneSections={phoneSections}
        choosePhoneLabel={choosePhoneLabel}
      />
      <AddressPicker
        pickerRef={addressRef}
        open={openMenu === "address"}
        onToggle={() =>
          setOpenMenu((menu) => (menu === "address" ? null : "address"))
        }
        locale={locale}
        locations={locations}
        addressesLabel={addressesLabel}
        storesLabel={storesLabel}
        openInMapsLabel={openInMapsLabel}
        chooseAddressLabel={chooseAddressLabel}
      />
    </div>
  );
}
