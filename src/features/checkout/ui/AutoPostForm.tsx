"use client";

import { useEffect, useRef } from "react";

type AutoPostFormProps = {
  action: string;
  fields: Record<string, string>;
  pendingLabel: string;
};

/** Submits a provider payment form once on mount (Idram GetPayment). */
export function AutoPostForm({
  action,
  fields,
  pendingLabel,
}: AutoPostFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const submittedRef = useRef(false);

  useEffect(() => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    formRef.current?.submit();
  }, []);

  return (
    <div className="mx-auto flex min-h-[40vh] max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-marco-slate">{pendingLabel}</p>
      <form
        ref={formRef}
        action={action}
        method="POST"
        acceptCharset="UTF-8"
        className="hidden"
      >
        {Object.entries(fields).map(([name, value]) => (
          <input key={name} type="hidden" name={name} value={value} />
        ))}
      </form>
    </div>
  );
}
