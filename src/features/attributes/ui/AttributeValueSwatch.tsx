import Image from "next/image";

import type { AdminAttributeValue } from "@/features/attributes/domain/attribute-admin-model";

type AttributeValueSwatchProps = {
  value: Pick<AdminAttributeValue, "colorHex" | "imageUrl">;
  size?: "sm" | "md" | "lg";
};

const SIZE_CLASS = {
  sm: "h-5 w-5",
  md: "h-6 w-6",
  lg: "h-14 w-14",
} as const;

/** Renders a color disk or image thumbnail for an attribute value. */
export function AttributeValueSwatch({
  value,
  size = "md",
}: AttributeValueSwatchProps) {
  const sizeClass = SIZE_CLASS[size];

  if (value.imageUrl) {
    return (
      <span
        className={`relative ${sizeClass} shrink-0 overflow-hidden rounded-full border border-gray-200`}
      >
        <Image
          src={value.imageUrl}
          alt=""
          fill
          sizes={size === "sm" ? "20px" : size === "lg" ? "56px" : "24px"}
          className="object-cover"
        />
      </span>
    );
  }

  if (value.colorHex) {
    return (
      <span
        className={`${sizeClass} shrink-0 rounded-full border border-gray-200`}
        style={{ backgroundColor: value.colorHex }}
      />
    );
  }

  return (
    <span
      className={`${sizeClass} shrink-0 rounded-full border border-dashed border-gray-300 bg-white`}
    />
  );
}
