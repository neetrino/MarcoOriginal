import type { Dictionary } from "@/lib/i18n/get-dictionary";

type StoresHeroProps = {
  copy: Dictionary["stores"];
};

export function StoresHero({ copy }: StoresHeroProps) {
  return (
    <header className="mb-12 text-center">
      <h1 className="text-4xl font-bold tracking-tight text-marco-slate md:text-5xl">
        {copy.title}
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-600">
        {copy.subtitle}
      </p>
    </header>
  );
}
