"use client";

import { useLanguage } from "@/components/language-provider";

export function WorkspaceError() {
  const { t } = useLanguage();
  return (
    <div
      role="alert"
      className="border-destructive/30 bg-destructive/5 text-destructive mx-auto max-w-3xl rounded-2xl border p-6 text-sm"
    >
      {t.workflow.dataUnavailable}
    </div>
  );
}
