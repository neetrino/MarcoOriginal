import Image from "next/image";

import { AppLink } from "@/components/ui/AppLink";
import type { CompareProductColumn } from "@/features/compare/types";
import { CompareAddToCartButton } from "@/features/compare/ui/CompareAddToCartButton";
import { CompareRemoveButton } from "@/features/compare/ui/CompareRemoveButton";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

type CompareTableProps = {
  products: readonly CompareProductColumn[];
  labels: Dictionary["compare"];
};

const cellClass =
  "border-t border-gray-100 px-4 py-5 text-center align-middle text-sm text-marco-ink";
const labelClass =
  "w-36 min-w-32 border-t border-gray-100 px-4 py-5 text-left text-sm text-gray-400";

export function CompareTable({ products, labels }: CompareTableProps) {
  return (
    <div className="overflow-x-auto rounded-3xl bg-gray-50">
      <table className="min-w-full border-separate border-spacing-0">
        <caption className="sr-only">{labels.title}</caption>
        <tbody>
          <ImageRow products={products} label={labels.image} removeLabel={labels.remove} />
          <NameRow products={products} label={labels.name} />
          <BrandRow products={products} label={labels.brand} />
          <PriceRow products={products} label={labels.price} />
          <StatusRow
            products={products}
            label={labels.status}
            available={labels.available}
            unavailable={labels.unavailable}
          />
          <ActionsRow
            products={products}
            label={labels.actions}
            addToCartLabel={labels.addToCart}
          />
        </tbody>
      </table>
    </div>
  );
}

function ImageRow({
  products,
  label,
  removeLabel,
}: {
  products: readonly CompareProductColumn[];
  label: string;
  removeLabel: string;
}) {
  return (
    <tr>
      <th scope="row" className={`${labelClass} border-t-0 font-normal`}>
        {label}
      </th>
      {products.map((product) => (
        <td key={product.id} className={`${cellClass} border-t-0 relative min-w-[14rem]`}>
          <div className="absolute top-3 right-3">
            <CompareRemoveButton productId={product.id} label={removeLabel} />
          </div>
          <div className="relative mx-auto h-28 w-40">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt=""
                fill
                sizes="160px"
                className="object-contain"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-300">
                —
              </div>
            )}
          </div>
        </td>
      ))}
    </tr>
  );
}

function NameRow({
  products,
  label,
}: {
  products: readonly CompareProductColumn[];
  label: string;
}) {
  return (
    <tr>
      <th scope="row" className={`${labelClass} font-normal`}>
        {label}
      </th>
      {products.map((product) => (
        <td key={product.id} className={`${cellClass} font-semibold`}>
          <AppLink href={product.href} className="hover:underline">
            {product.title}
          </AppLink>
        </td>
      ))}
    </tr>
  );
}

function BrandRow({
  products,
  label,
}: {
  products: readonly CompareProductColumn[];
  label: string;
}) {
  return (
    <tr>
      <th scope="row" className={`${labelClass} font-normal`}>
        {label}
      </th>
      {products.map((product) => (
        <td key={product.id} className={cellClass}>
          {product.brand ?? "—"}
        </td>
      ))}
    </tr>
  );
}

function PriceRow({
  products,
  label,
}: {
  products: readonly CompareProductColumn[];
  label: string;
}) {
  return (
    <tr>
      <th scope="row" className={`${labelClass} font-normal`}>
        {label}
      </th>
      {products.map((product) => (
        <td key={product.id} className={cellClass}>
          <p className="text-xl font-black">{product.priceFormatted}</p>
          {product.compareAtFormatted ? (
            <p className="mt-1 text-xs text-gray-400 line-through">
              {product.compareAtFormatted}
            </p>
          ) : null}
        </td>
      ))}
    </tr>
  );
}

function StatusRow({
  products,
  label,
  available,
  unavailable,
}: {
  products: readonly CompareProductColumn[];
  label: string;
  available: string;
  unavailable: string;
}) {
  return (
    <tr>
      <th scope="row" className={`${labelClass} font-normal`}>
        {label}
      </th>
      {products.map((product) => (
        <td key={product.id} className={cellClass}>
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
              product.inStock
                ? "bg-emerald-50 text-emerald-600"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {product.inStock ? available : unavailable}
          </span>
        </td>
      ))}
    </tr>
  );
}

function ActionsRow({
  products,
  label,
  addToCartLabel,
}: {
  products: readonly CompareProductColumn[];
  label: string;
  addToCartLabel: string;
}) {
  return (
    <tr>
      <th scope="row" className={`${labelClass} font-normal`}>
        {label}
      </th>
      {products.map((product) => (
        <td key={product.id} className={cellClass}>
          <CompareAddToCartButton
            productId={product.id}
            label={addToCartLabel}
            disabled={!product.inStock}
            imageUrl={product.imageUrl}
          />
        </td>
      ))}
    </tr>
  );
}
