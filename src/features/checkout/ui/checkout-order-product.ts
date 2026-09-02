export type CheckoutOrderProduct = {
  id: string;
  title: string;
  quantity: number;
  imageUrl: string | null;
  /** Unit price already formatted for display (e.g. `13 534 ֏`). */
  priceFormatted: string;
};
