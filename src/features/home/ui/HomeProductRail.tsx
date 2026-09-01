"use client";

import { chunkItems } from "@/features/home/paginate";
import { HomePaginationDots } from "@/features/home/ui/HomePaginationDots";
import {
  ProductCard,
  type ProductCardItem,
} from "@/features/products/ui/ProductCard";
import { HomeSectionHeading } from "@/features/home/ui/HomeSectionHeading";
import { HomeSeeMoreCta } from "@/features/home/ui/HomeSeeMoreCta";
import {
  HOME_PAGE_SHELL_CLASS,
  HOME_SCROLLER_CLASS,
} from "@/features/home/ui/home-section-classes";
import {
  HOME_DOTS_TO_CTA_GAP_PX,
  HOME_PRODUCT_CARD_GAP_PX,
  HOME_PRODUCT_DESKTOP_PAGE_SIZE,
  HOME_PRODUCT_MOBILE_PAGE_SIZE,
  HOME_RAIL_TO_DOTS_GAP_PX,
  HOME_TITLE_TO_RAIL_GAP_PX,
} from "@/features/home/ui/home-section.constants";
import {
  PRODUCT_CARD_MOBILE_GRID_COLUMN_GAP_PX,
  PRODUCT_CARD_MOBILE_RAIL_PAGE_GAP_PX,
  PRODUCT_CARD_RAIL_MOBILE_PADDING_BOTTOM_PX,
} from "@/features/products/ui/product-card.constants";
import { useIsMaxMd } from "@/features/home/ui/use-is-max-md";
import { useSnapCarousel } from "@/features/home/ui/use-snap-carousel";
import type { Locale } from "@/lib/i18n/config";

type HomeProductRailProps = {
  headingId: string;
  locale: Locale;
  title: string;
  titleHighlight?: string;
  titleRest?: string;
  viewAllLabel: string;
  viewAllHref: string;
  emptyLabel: string;
  wishlistLabel: string;
  compareLabel: string;
  addToCartLabel: string;
  previousPageLabel: string;
  nextPageLabel: string;
  paginationLabel: string;
  isSignedIn: boolean;
  products: readonly ProductCardItem[];
  priorityCount?: number;
};

export function HomeProductRail({
  headingId,
  locale,
  title,
  titleHighlight,
  titleRest,
  viewAllLabel,
  viewAllHref,
  emptyLabel,
  wishlistLabel,
  compareLabel,
  addToCartLabel,
  previousPageLabel,
  nextPageLabel,
  paginationLabel,
  isSignedIn,
  products,
  priorityCount = 4,
}: HomeProductRailProps) {
  const isMaxMd = useIsMaxMd();
  const mobile = useSnapCarousel(
    Math.max(chunkItems(products, HOME_PRODUCT_MOBILE_PAGE_SIZE).length, 1),
  );
  const desktop = useSnapCarousel(
    Math.max(chunkItems(products, HOME_PRODUCT_DESKTOP_PAGE_SIZE).length, 1),
  );
  const activeRail = isMaxMd ? mobile : desktop;

  return (
    <section className="bg-white py-8 md:py-10" aria-labelledby={headingId}>
      <div className={HOME_PAGE_SHELL_CLASS}>
        <div style={{ marginBottom: HOME_TITLE_TO_RAIL_GAP_PX }}>
          <HomeSectionHeading
            id={headingId}
            title={title}
            titleHighlight={titleHighlight}
            titleRest={titleRest}
            prevLabel={previousPageLabel}
            nextLabel={nextPageLabel}
            onPrev={() => activeRail.scrollToPage(activeRail.activePage - 1)}
            onNext={() => activeRail.scrollToPage(activeRail.activePage + 1)}
            canScrollPrev={activeRail.canScrollPrev}
            canScrollNext={activeRail.canScrollNext}
            titleInsetClassName="pl-4"
          />
        </div>
        {products.length === 0 ? (
          <p className="text-sm text-marco-slate">{emptyLabel}</p>
        ) : (
          <HomeProductRailPages
            locale={locale}
            products={products}
            wishlistLabel={wishlistLabel}
            compareLabel={compareLabel}
            addToCartLabel={addToCartLabel}
            paginationLabel={paginationLabel}
            isSignedIn={isSignedIn}
            priorityCount={priorityCount}
            viewAllHref={viewAllHref}
            viewAllLabel={viewAllLabel}
            mobile={mobile}
            desktop={desktop}
          />
        )}
      </div>
    </section>
  );
}

type RailPagesProps = {
  locale: Locale;
  products: readonly ProductCardItem[];
  wishlistLabel: string;
  compareLabel: string;
  addToCartLabel: string;
  paginationLabel: string;
  isSignedIn: boolean;
  priorityCount: number;
  viewAllHref: string;
  viewAllLabel: string;
  mobile: ReturnType<typeof useSnapCarousel>;
  desktop: ReturnType<typeof useSnapCarousel>;
};

function HomeProductRailPages({
  locale,
  products,
  wishlistLabel,
  compareLabel,
  addToCartLabel,
  paginationLabel,
  isSignedIn,
  priorityCount,
  viewAllHref,
  viewAllLabel,
  mobile,
  desktop,
}: RailPagesProps) {
  const cardProps = {
    locale,
    wishlistLabel,
    compareLabel,
    addToCartLabel,
    isSignedIn,
  };

  return (
    <>
      <div className="md:hidden">
        <ProductSnapPages
          scrollerRef={mobile.scrollerRef}
          onScroll={mobile.onScroll}
          pages={chunkItems(products, HOME_PRODUCT_MOBILE_PAGE_SIZE)}
          columns={HOME_PRODUCT_MOBILE_PAGE_SIZE}
          cardLayout="mobileGrid"
          cardProps={cardProps}
          priorityCount={priorityCount}
        />
      </div>
      <div className="hidden md:block">
        <ProductSnapPages
          scrollerRef={desktop.scrollerRef}
          onScroll={desktop.onScroll}
          pages={chunkItems(products, HOME_PRODUCT_DESKTOP_PAGE_SIZE)}
          columns={HOME_PRODUCT_DESKTOP_PAGE_SIZE}
          cardProps={cardProps}
          priorityCount={priorityCount}
        />
      </div>
      <div style={{ marginTop: HOME_RAIL_TO_DOTS_GAP_PX }}>
        <div className="md:hidden">
          <HomePaginationDots
            pageCount={chunkItems(products, HOME_PRODUCT_MOBILE_PAGE_SIZE).length}
            activePage={mobile.activePage}
            label={paginationLabel}
            onGoToPage={mobile.scrollToPage}
          />
        </div>
        <div className="hidden md:block">
          <HomePaginationDots
            pageCount={chunkItems(products, HOME_PRODUCT_DESKTOP_PAGE_SIZE).length}
            activePage={desktop.activePage}
            label={paginationLabel}
            onGoToPage={desktop.scrollToPage}
          />
        </div>
      </div>
      <div style={{ marginTop: HOME_DOTS_TO_CTA_GAP_PX }}>
        <HomeSeeMoreCta href={viewAllHref} label={viewAllLabel} />
      </div>
    </>
  );
}

type ProductSnapPagesProps = {
  scrollerRef: ReturnType<typeof useSnapCarousel>["scrollerRef"];
  onScroll: () => void;
  pages: ProductCardItem[][];
  columns: number;
  cardLayout?: "default" | "mobileGrid";
  cardProps: {
    locale: Locale;
    wishlistLabel: string;
    compareLabel: string;
    addToCartLabel: string;
    isSignedIn: boolean;
  };
  priorityCount: number;
};

function ProductSnapPages({
  scrollerRef,
  onScroll,
  pages,
  columns,
  cardLayout = "default",
  cardProps,
  priorityCount,
}: ProductSnapPagesProps) {
  const isMobileGrid = cardLayout === "mobileGrid";
  const pageGapPx = isMobileGrid
    ? PRODUCT_CARD_MOBILE_RAIL_PAGE_GAP_PX
    : HOME_PRODUCT_CARD_GAP_PX;
  const columnGapPx = isMobileGrid
    ? PRODUCT_CARD_MOBILE_GRID_COLUMN_GAP_PX
    : HOME_PRODUCT_CARD_GAP_PX;

  return (
    <div
      ref={scrollerRef}
      onScroll={onScroll}
      className={HOME_SCROLLER_CLASS}
      style={{
        gap: pageGapPx,
        scrollSnapType: "x mandatory",
        paddingBottom: isMobileGrid
          ? PRODUCT_CARD_RAIL_MOBILE_PADDING_BOTTOM_PX
          : undefined,
      }}
    >
      {pages.map((page, pageIndex) => (
        <div
          key={`home-products-page-${pageIndex}`}
          className="grid min-h-0 w-full max-w-full shrink-0 grow-0 basis-full snap-start snap-always justify-items-stretch"
          style={{
            gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            columnGap: columnGapPx,
            rowGap: 0,
          }}
        >
          {page.map((product, slotIndex) => (
            <div key={product.id} className="flex min-h-0 w-full min-w-0">
              <ProductCard
                product={product}
                priority={pageIndex === 0 && slotIndex < priorityCount}
                layout={cardLayout}
                maxWidthClassName={
                  isMobileGrid ? "max-w-none" : undefined
                }
                {...cardProps}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
