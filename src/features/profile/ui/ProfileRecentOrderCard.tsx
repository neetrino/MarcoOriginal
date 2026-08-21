import { PROFILE_ORDER_ROW_CLASS } from "@/features/profile/ui/profile-surface-classes";

type ProfileRecentOrderCardProps = {
  orderNumber: string;
  status: string;
  totalLabel: string;
  metaLine: string;
  placedOnLine: string;
  orderNumberLabel: string;
  viewDetailsLabel: string;
  statusLabel: string;
  onViewDetails: () => void;
};

export function ProfileRecentOrderCard({
  orderNumber,
  status,
  totalLabel,
  metaLine,
  placedOnLine,
  orderNumberLabel,
  viewDetailsLabel,
  statusLabel,
  onViewDetails,
}: ProfileRecentOrderCardProps) {
  return (
    <button
      type="button"
      onClick={onViewDetails}
      className={`w-full text-left ${PROFILE_ORDER_ROW_CLASS}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-6">
            <h3 className="text-lg font-semibold text-marco-slate">
              {orderNumberLabel} {orderNumber}
            </h3>
            <div>
              <p className="mb-0.5 text-[11px] tracking-wide text-marco-slate/50 uppercase">
                {statusLabel}
              </p>
              <span className="inline-flex rounded-full bg-marco-gray px-2 py-1 text-xs font-medium text-marco-slate capitalize">
                {status}
              </span>
            </div>
          </div>
          <p className="text-sm text-marco-slate/70">
            {metaLine} • {placedOnLine}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-lg font-bold text-marco-slate">{totalLabel}</p>
          <p className="mt-1 text-xs text-marco-slate/50">{viewDetailsLabel}</p>
        </div>
      </div>
    </button>
  );
}
