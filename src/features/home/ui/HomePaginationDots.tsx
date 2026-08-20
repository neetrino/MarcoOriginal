import { HOME_DOT_SIZE_PX } from "@/features/home/ui/home-section.constants";

type HomePaginationDotsProps = {
  pageCount: number;
  activePage: number;
  label: string;
  onGoToPage: (page: number) => void;
};

export function HomePaginationDots({
  pageCount,
  activePage,
  label,
  onGoToPage,
}: HomePaginationDotsProps) {
  if (pageCount <= 1) return null;

  return (
    <div
      className="flex flex-row items-center justify-center gap-1.5 md:gap-2.5"
      role="tablist"
      aria-label={label}
    >
      {Array.from({ length: pageCount }, (_, index) => (
        <button
          key={index}
          type="button"
          role="tab"
          aria-selected={activePage === index}
          aria-label={`${label} ${index + 1}`}
          onClick={() => onGoToPage(index)}
          className={`rounded-full p-0 transition-colors ${
            activePage === index
              ? "bg-[#181111]"
              : "bg-gray-300 hover:bg-gray-400"
          }`}
          style={{ width: HOME_DOT_SIZE_PX, height: HOME_DOT_SIZE_PX }}
        />
      ))}
    </div>
  );
}
