type HeaderCartButtonProps = {
  open: boolean;
  badgeCount: number;
  totalLabel: string;
  label: string;
  openDrawer: () => void;
  prefetchDrawerView: () => void;
};

function HeaderCartTrolleyIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className="h-[21px] w-[22px] shrink-0"
      aria-hidden
    >
      <path
        d="M4 5.5L6 7.5"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
      />
      <path
        d="M6 7.5L8.25 16.5H17.5L19.5 7.5H8"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10.25" cy="19" r="1.35" fill="currentColor" />
      <circle cx="16.25" cy="19" r="1.35" fill="currentColor" />
    </svg>
  );
}

export function HeaderCartButton({
  open,
  badgeCount,
  totalLabel,
  label,
  openDrawer,
  prefetchDrawerView,
}: HeaderCartButtonProps) {
  return (
    <button
      type="button"
      onClick={openDrawer}
      onPointerEnter={prefetchDrawerView}
      onFocus={prefetchDrawerView}
      className="relative inline-flex h-10 min-w-[124px] shrink-0 items-center justify-center gap-[11px] rounded-[68px] bg-marco-yellow pr-3.5 pl-4 text-xs font-bold leading-tight text-marco-slate transition-[filter] hover:brightness-95 active:brightness-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marco-slate/25"
      aria-label={label}
      aria-expanded={open}
      data-cart-fly-target
    >
      <HeaderCartTrolleyIcon />
      <span className="tabular-nums">{totalLabel}</span>
      {badgeCount > 0 ? (
        <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[18px] items-center justify-center rounded-full bg-red-600 px-0.5 text-[9px] font-bold leading-none text-white">
          {badgeCount > 99 ? "99+" : badgeCount}
        </span>
      ) : null}
    </button>
  );
}
