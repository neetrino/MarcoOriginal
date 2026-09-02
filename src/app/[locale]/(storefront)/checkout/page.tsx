import { notFound } from "next/navigation";

import { getCartWithItems } from "@/features/cart/cart";
import { getCheckoutDeliveryOptions } from "@/features/checkout/application/get-checkout-delivery";
import { getCheckoutOrderProducts } from "@/features/checkout/application/get-checkout-order-products";
import { CheckoutForm } from "@/features/checkout/ui/CheckoutForm";
import { buildContactLocations } from "@/features/contact/content/contact-locations";
import { getDefaultShippingAddress } from "@/features/profile/application/address-queries";
import { resolveProductPrices } from "@/features/promotions/application/resolve-product-prices";
import { getCurrentUser } from "@/lib/auth/session";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

type CheckoutPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    notFound();
  }

  const dictionary = getDictionary(rawLocale);
  const copy = dictionary.checkout;
  const [user, { items }, deliveryOptions] = await Promise.all([
    getCurrentUser(),
    getCartWithItems(),
    getCheckoutDeliveryOptions(),
  ]);
  const [defaultAddress, prices] = await Promise.all([
    user ? getDefaultShippingAddress(user.id) : Promise.resolve(null),
    resolveProductPrices(
      items.map(({ product }) => ({
        id: product.id,
        priceAmount: product.priceAmount,
        compareAtAmount: product.compareAtAmount,
      })),
    ),
  ]);
  const orderProducts = await getCheckoutOrderProducts(
    rawLocale,
    items,
    prices,
  );
  const subtotal = items.reduce((sum, { item, product }) => {
    const unit = prices.get(product.id)?.unitAmount ?? product.priceAmount;
    return sum + item.quantity * unit;
  }, 0);
  const pickupBranches = buildContactLocations(
    dictionary.contact.locations,
  ).map((location) => ({
    id: location.id,
    label: location.address,
  }));

  return (
    <CheckoutForm
      locale={rawLocale}
      productsHref={`/${rawLocale}/products`}
      hasItems={items.length > 0}
      orderProducts={orderProducts}
      pickupBranches={pickupBranches}
      defaultFirstName={
        defaultAddress?.recipientFirstName ?? user?.firstName ?? ""
      }
      defaultLastName={
        defaultAddress?.recipientLastName ?? user?.lastName ?? ""
      }
      defaultEmail={user?.email ?? ""}
      defaultPhone={defaultAddress?.phone ?? user?.phone ?? ""}
      defaultLine1={defaultAddress?.line1 ?? ""}
      subtotalAmount={subtotal}
      deliveryOptions={deliveryOptions}
      labels={{
        title: copy.title,
        productsInOrder: copy.productsInOrder,
        itemsOne: copy.itemsOne,
        itemsMany: copy.itemsMany,
        removeItem: copy.removeItem,
        contactInformation: copy.contactInformation,
        shippingMethod: copy.shippingMethod,
        paymentMethod: copy.paymentMethod,
        orderSummary: copy.orderSummary,
        firstName: copy.form.firstName,
        lastName: copy.form.lastName,
        email: copy.form.email,
        phone: copy.form.phone,
        address: copy.form.address,
        notes: copy.form.notes,
        notesPlaceholder: copy.placeholders.notes,
        deliveryLocation: copy.form.deliveryLocation,
        selectLocation: copy.form.selectLocation,
        phonePlaceholder: copy.placeholders.phone,
        addressPlaceholder: copy.placeholders.address,
        pickupToggle: copy.shipping.pickupToggle,
        deliveryToggle: copy.shipping.deliveryToggle,
        branchAddress: copy.form.branchAddress,
        selectBranch: copy.shipping.selectBranch,
        branchRequired: copy.errors.branchRequired,
        freePickup: copy.shipping.freePickup,
        selectDeliveryLocation: copy.shipping.selectDeliveryLocation,
        cashOnDelivery: copy.payment.cash,
        cashOnDeliveryDescription: copy.payment.cashDescription,
        idram: copy.payment.idram,
        idramDescription: copy.payment.idramDescription,
        card: copy.payment.arca,
        cardDescription: copy.payment.arcaDescription,
        couponTitle: copy.coupon.title,
        couponPlaceholder: copy.coupon.placeholder,
        couponApply: copy.coupon.apply,
        couponApplying: copy.coupon.applying,
        discount: copy.summary.discount,
        subtotal: copy.summary.subtotal,
        shipping: copy.summary.shipping,
        total: copy.summary.total,
        placeOrder: copy.buttons.placeOrder,
        processing: copy.buttons.processing,
        continueShopping: copy.buttons.continueShopping,
        browseProducts: copy.buttons.browseProducts,
        cartEmpty: copy.errors.cartEmpty,
      }}
    />
  );
}
