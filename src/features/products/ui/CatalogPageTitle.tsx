import {
  CATALOG_PAGE_TITLE,
  CATALOG_PAGE_TITLE_BAR,
} from "@/features/products/ui/catalog-filter-classes";

type CatalogPageTitleProps = {
  title: string;
};

export function CatalogPageTitle({ title }: CatalogPageTitleProps) {
  return (
    <div className="flex flex-col items-start gap-3">
      <h1 className={CATALOG_PAGE_TITLE}>{title}</h1>
      <span className={CATALOG_PAGE_TITLE_BAR} aria-hidden />
    </div>
  );
}
