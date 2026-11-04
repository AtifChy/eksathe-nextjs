"use client";

import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

import { useLanguage } from "@/components/language-provider";
import { CreateProjectForm } from "@/components/projects/project-forms";

export function CreateProjectEntry({
  context,
}: {
  context?: { serviceSlug?: string; listingId?: string; labelBn?: string; labelEn?: string };
}) {
  const { locale, t } = useLanguage();
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8 sm:px-6">
      <Link
        href="/account#projects"
        className="text-muted-foreground hover:text-foreground inline-flex w-fit items-center gap-2 text-sm"
      >
        <ArrowLeftIcon aria-hidden="true" className="size-4" />
        {locale === "bn" ? "আমার প্রকল্প" : "My projects"}
      </Link>
      <div>
        <p className="text-primary text-sm">{t.home.construction}</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">{t.workflow.createProject}</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          {locale === "bn"
            ? "কাজের বিবরণ যোগ করুন। পরে নির্মাণ পেশাজীবীদের দরপ্রস্তাবের জন্য আমন্ত্রণ জানাতে পারবেন।"
            : "Describe the work. You can invite construction providers to quote after creating the project."}
        </p>
      </div>
      {context?.labelBn && context.labelEn && (
        <p className="border-border/70 bg-muted/40 rounded-xl border p-4 text-sm">
          {locale === "bn" ? "নির্বাচিত সেবা" : "Selected service"}:{" "}
          <strong>{locale === "bn" ? context.labelBn : context.labelEn}</strong>
        </p>
      )}
      <CreateProjectForm context={context} />
    </div>
  );
}
