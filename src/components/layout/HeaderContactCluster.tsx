import { MapPin, Phone } from "lucide-react";

type HeaderContactClusterProps = {
  phone: string;
  address: string;
};

export function HeaderContactCluster({
  phone,
  address,
}: HeaderContactClusterProps) {
  const telHref = `tel:${phone.replace(/\s/g, "")}`;

  return (
    <div className="flex h-10 shrink-0 flex-nowrap items-center gap-x-[29px] text-marco-slate">
      <a
        href={telHref}
        className="flex h-10 items-center gap-2 text-xs font-semibold transition-opacity hover:opacity-80"
      >
        <Phone className="h-4 w-4 shrink-0" aria-hidden />
        <span className="whitespace-nowrap">{phone}</span>
      </a>
      <p className="flex h-10 max-w-[14rem] items-center gap-2 text-xs font-semibold">
        <MapPin className="h-4 w-4 shrink-0" aria-hidden />
        <span className="line-clamp-2 leading-tight">{address}</span>
      </p>
    </div>
  );
}
