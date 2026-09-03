"use client";

import { useState } from "react";
import { ChevronRight, Phone } from "lucide-react";

import {
  MOBILE_DRAWER_CONTACT_COMPACT_CLASS,
  MOBILE_DRAWER_CTA_COMPACT_CLASS,
  mobileDrawerCompactPillClass,
} from "@/components/layout/mobile-nav-drawer.classes";
import { AppLink } from "@/components/ui/AppLink";
import {
  buildContactLocations,
  buildContactPhoneSections,
  contactLocationMapHref,
  phoneToTelHref,
  type ContactLocationId,
  type ContactPhoneSection,
  type ContactPhoneSectionId,
} from "@/features/contact/content/contact-locations";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

type CallFlow = "idle" | "branches" | "phones";

type MobileNavDrawerCallSectionProps = {
  locale: Locale;
  dictionary: Dictionary;
  onClose: () => void;
};

function CallIdle({
  dictionary,
  onStart,
}: {
  dictionary: Dictionary;
  onStart: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onStart}
      className={MOBILE_DRAWER_CTA_COMPACT_CLASS}
      aria-label={dictionary.contact.drawerCall.cta}
    >
      <Phone className="h-5 w-5 shrink-0" strokeWidth={2} aria-hidden />
    </button>
  );
}

function CallBranches({
  sections,
  dictionary,
  onSelect,
  onCancel,
}: {
  sections: readonly ContactPhoneSection[];
  dictionary: Dictionary;
  onSelect: (id: ContactPhoneSectionId) => void;
  onCancel: () => void;
}) {
  return (
    <div className="space-y-2.5">
      <p className="text-center text-[11px] font-bold uppercase leading-tight tracking-wide text-marco-black">
        {dictionary.contact.drawerCall.chooseBranchTitle}
      </p>
      <div className="flex flex-col gap-2">
        {sections.map((section) => (
          <button
            key={section.id}
            type="button"
            onClick={() => onSelect(section.id)}
            className={mobileDrawerCompactPillClass(false)}
          >
            <span className="min-w-0 flex-1 whitespace-normal text-left leading-snug">
              {section.label}
            </span>
            <ChevronRight className="h-5 w-5 shrink-0 opacity-50" aria-hidden />
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={onCancel}
        className="w-full py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-marco-black/75 underline-offset-2 hover:underline"
      >
        {dictionary.contact.drawerCall.cancel}
      </button>
    </div>
  );
}

function CallPhones({
  locale,
  section,
  dictionary,
  onClose,
  onChangeBranch,
}: {
  locale: Locale;
  section: ContactPhoneSection;
  dictionary: Dictionary;
  onClose: () => void;
  onChangeBranch: () => void;
}) {
  const isStore = section.id !== "delivery";

  return (
    <div className="space-y-2.5">
      <p className="text-left text-xs font-bold leading-snug text-marco-black">
        {section.label}
      </p>
      {isStore ? (
        <AppLink
          href={contactLocationMapHref(locale, section.id as ContactLocationId)}
          prefetchPolicy="intent"
          onClick={onClose}
          className="inline-flex text-[10px] font-semibold uppercase tracking-wide text-marco-yellow underline-offset-2 hover:underline"
        >
          {dictionary.contact.mapSectionTitle}
        </AppLink>
      ) : null}
      <div className="flex flex-col gap-2">
        {section.phones.map((phone) => (
          <a
            key={`${section.id}-${phone}`}
            href={phoneToTelHref(phone)}
            onClick={onClose}
            className={`${MOBILE_DRAWER_CONTACT_COMPACT_CLASS} normal-case`}
            aria-label={`${section.label} — ${phone}`}
          >
            <Phone className="h-6 w-6 shrink-0" strokeWidth={2} aria-hidden />
            <span>{phone}</span>
          </a>
        ))}
      </div>
      <button
        type="button"
        onClick={onChangeBranch}
        className={mobileDrawerCompactPillClass(false, true)}
      >
        {dictionary.contact.drawerCall.changeBranch}
      </button>
    </div>
  );
}

/** Compact call flow for the mobile menu popup footer. */
export function MobileNavDrawerCallSection({
  locale,
  dictionary,
  onClose,
}: MobileNavDrawerCallSectionProps) {
  const [callFlow, setCallFlow] = useState<CallFlow>("idle");
  const [callBranchId, setCallBranchId] = useState<ContactPhoneSectionId | null>(
    null,
  );
  const sections = buildContactPhoneSections(
    buildContactLocations(dictionary.contact.locations),
    dictionary.contact.deliveryPhonesLabel,
  );
  const selectedSection =
    callFlow === "phones" && callBranchId !== null
      ? (sections.find((section) => section.id === callBranchId) ?? null)
      : null;

  return (
    <div className="mb-4 space-y-3">
      {callFlow === "idle" ? (
        <CallIdle
          dictionary={dictionary}
          onStart={() => setCallFlow("branches")}
        />
      ) : null}
      {callFlow === "branches" ? (
        <CallBranches
          sections={sections}
          dictionary={dictionary}
          onSelect={(id) => {
            setCallBranchId(id);
            setCallFlow("phones");
          }}
          onCancel={() => setCallFlow("idle")}
        />
      ) : null}
      {selectedSection ? (
        <CallPhones
          locale={locale}
          section={selectedSection}
          dictionary={dictionary}
          onClose={onClose}
          onChangeBranch={() => {
            setCallBranchId(null);
            setCallFlow("branches");
          }}
        />
      ) : null}
    </div>
  );
}
