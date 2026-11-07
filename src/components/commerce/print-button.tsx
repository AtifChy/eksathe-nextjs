"use client";

export function PrintButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-md border px-3 py-2 print:hidden"
    >
      {label}
    </button>
  );
}
