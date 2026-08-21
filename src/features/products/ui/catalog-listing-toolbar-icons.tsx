export function CatalogSortSlidersIcon() {
  return (
    <svg width="18" height="14" viewBox="0 0 16 12" fill="none" aria-hidden>
      <line x1="1" y1="2" x2="15" y2="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="4" cy="2" r="2" fill="currentColor" />
      <line x1="1" y1="6" x2="15" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="6" r="2" fill="currentColor" />
      <line x1="1" y1="10" x2="15" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="10" r="2" fill="currentColor" />
    </svg>
  );
}

export function CatalogViewListIcon() {
  return (
    <svg className="h-[22px] w-[22px]" viewBox="0 0 20 20" fill="none" aria-hidden>
      <line x1="3" y1="5" x2="17" y2="5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="3" y1="10" x2="17" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="3" y1="15" x2="17" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function CatalogViewGridIcon() {
  const dots = [5, 10, 15];
  return (
    <svg className="h-[22px] w-[22px]" viewBox="0 0 20 20" aria-hidden>
      {dots.flatMap((y) =>
        dots.map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.75" fill="currentColor" />),
      )}
    </svg>
  );
}

export function CatalogViewDenseGridIcon() {
  const dots = [4, 8, 12, 16];
  return (
    <svg className="h-[22px] w-[22px]" viewBox="0 0 20 20" aria-hidden>
      {dots.flatMap((y) =>
        dots.map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.25" fill="currentColor" />),
      )}
    </svg>
  );
}

export function CatalogFiltersIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
      <line x1="3" y1="5" x2="17" y2="5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="3" y1="10" x2="17" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="3" y1="15" x2="17" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function CatalogSortChevron({ open }: { open: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 12 12"
      fill="none"
      className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
      aria-hidden
    >
      <path
        d="M3 4.5L6 7.5L9 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
