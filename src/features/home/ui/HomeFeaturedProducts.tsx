import { HomeProductRail } from "@/features/home/ui/HomeProductRail";
import type { ProductCardItem } from "@/features/products/ui/ProductCard";
import type { Locale } from "@/lib/i18n/config";

type HomeFeaturedProductsProps = {
  headingId: string;
  locale: Locale;
  title: string;
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

export function HomeFeaturedProducts(props: HomeFeaturedProductsProps) {
  return <HomeProductRail {...props} />;
}
