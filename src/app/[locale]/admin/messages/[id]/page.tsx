import Link from "next/link";
import { notFound } from "next/navigation";

import { Card } from "@/components/ui/Card";
import {
  ADMIN_PAGE_SUBTITLE,
  ADMIN_PAGE_TITLE,
  ADMIN_SECTION_TITLE,
} from "@/features/admin/ui/admin-form-classes";
import {
  formatAdminMessage,
  getAdminCopy,
} from "@/features/admin/ui/get-admin-copy";
import { ADMIN_BADGE } from "@/features/admin/ui/status-badge";
import { getAdminContactMessageById } from "@/features/contact/application/queries";
import {
  getEligibleContactStatuses,
  isContactStatus,
} from "@/features/contact/domain/contact-rules";
import { UpdateContactStatusForm } from "@/features/contact/ui/UpdateContactStatusForm";
import { isLocale } from "@/lib/i18n/config";

type AdminMessageDetailPageProps = {
  params: Promise<{ locale: string; id: string }>;
};

function contactStatusBadgeClass(status: string): string {
  const normalized = status.toUpperCase();
  if (normalized === "UNREAD") return "bg-blue-100 text-blue-800";
  if (normalized === "READ") return "bg-yellow-100 text-yellow-800";
  if (normalized === "REPLIED") return "bg-green-100 text-green-800";
  if (normalized === "ARCHIVED") return "bg-gray-100 text-gray-800";
  return "bg-gray-100 text-gray-800";
}

export default async function AdminMessageDetailPage({
  params,
}: AdminMessageDetailPageProps) {
  const { locale, id } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  const message = await getAdminContactMessageById(id);
  if (!message) {
    notFound();
  }

  const status = isContactStatus(message.status) ? message.status : null;
  const eligible = status ? getEligibleContactStatuses(status) : [];
  const copy = getAdminCopy(locale).messages;
  const receivedAt = message.createdAt
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  return (
    <section>
      <div className="mb-6">
        <p className={`mb-1 ${ADMIN_PAGE_SUBTITLE}`}>
          <Link
            href={`/${locale}/admin/messages`}
            className="font-medium text-marco-slate hover:underline"
          >
            {copy.detailBack}
          </Link>
        </p>
        <h1 className={ADMIN_PAGE_TITLE}>{message.subject}</h1>
      </div>

      <Card className="mb-6 p-6">
        <div className="grid gap-3 text-sm md:grid-cols-2">
          <p className="text-gray-700">
            {formatAdminMessage(copy.from, { name: message.name })}
          </p>
          <p className="text-gray-700">
            {formatAdminMessage(copy.email, { value: message.email })}
          </p>
          <p className="text-gray-700">
            {formatAdminMessage(copy.phone, { value: message.phone ?? "—" })}
          </p>
          <p className="text-gray-700">
            {copy.statusLabel}:{" "}
            <span
              className={`${ADMIN_BADGE} ${contactStatusBadgeClass(message.status)}`}
            >
              {message.status}
            </span>
          </p>
          <p className="text-gray-700">
            {formatAdminMessage(copy.spamScore, {
              value: message.spamScore === null ? "—" : message.spamScore,
            })}
          </p>
          <p className="text-gray-700">
            {formatAdminMessage(copy.received, { datetime: receivedAt })}
          </p>
        </div>
      </Card>

      <Card className="mb-6 p-6">
        <h2 className={`mb-3 ${ADMIN_SECTION_TITLE}`}>{copy.body}</h2>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
          {message.message}
        </p>
      </Card>

      {status ? (
        <UpdateContactStatusForm
          locale={locale}
          messageId={message.id}
          currentStatus={status}
          eligibleStatuses={eligible}
        />
      ) : (
        <p className="text-sm text-red-700">{copy.unknownStatus}</p>
      )}
    </section>
  );
}
