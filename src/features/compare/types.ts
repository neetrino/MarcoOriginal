export type CompareProductColumn = {
  id: string;
  href: string;
  title: string;
  brand: string | null;
  imageUrl: string | null;
  priceFormatted: string;
  compareAtFormatted: string | null;
  inStock: boolean;
};

export type ComparePageView = {
  heading: string | null;
  products: CompareProductColumn[];
  count: number;
  max: number;
};
