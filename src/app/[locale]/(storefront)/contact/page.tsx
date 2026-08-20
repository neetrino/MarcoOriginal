import { notFound } from "next/navigation";

import { buildContactLocations } from "@/features/contact/content/contact-locations";
import { ContactForm } from "@/features/contact/ui/ContactForm";
import { ContactInfo } from "@/features/contact/ui/ContactInfo";
import { ContactMap } from "@/features/contact/ui/ContactMap";
import {
  CONTACT_PAGE_SHELL_CLASS,
  CONTACT_SECTION_INNER_CLASS,
} from "@/features/contact/ui/contact-section-classes";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

type ContactPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale: rawLocale } = await params;

  if (!isLocale(rawLocale)) {
    notFound();
  }

  const dictionary = getDictionary(rawLocale);
  const locations = buildContactLocations(dictionary.contact.locations);

  return (
    <div className={CONTACT_PAGE_SHELL_CLASS}>
      <div className={CONTACT_SECTION_INNER_CLASS}>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:items-start md:gap-12 lg:gap-16">
          <ContactInfo copy={dictionary.contact} locations={locations} />
          <ContactForm copy={dictionary.contact.form} />
        </div>
      </div>
      <ContactMap
        locations={locations}
        sectionTitle={dictionary.contact.mapSectionTitle}
      />
    </div>
  );
}
