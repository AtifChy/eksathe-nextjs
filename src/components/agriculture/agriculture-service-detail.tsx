"use client";

import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { AgricultureService } from "@/lib/agriculture/service-registry";
import { cn } from "cn";

export function AgricultureServiceDetail({ service, routeBase }: { service: AgricultureService; routeBase: string }) {
  const { locale } = useLanguage();
  const english = locale === "en";
  const returnTo = `${routeBase}/services/${service.slug}`;

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6">
      <Link href={routeBase} className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeftIcon aria-hidden="true" className="size-4" />{english ? "All agriculture services" : "সব কৃষিসেবা"}</Link>
      <Card>
        <CardHeader className="gap-4 sm:flex-row sm:items-start"><span aria-hidden="true" className="text-5xl">{service.icon}</span><div><p className="text-sm font-semibold text-primary">{english ? service.titleEn : service.titleBn}</p><CardTitle className="mt-1 text-3xl">{english ? service.titleEn : service.titleBn}</CardTitle><CardDescription className="mt-3 max-w-3xl text-base leading-7">{english ? service.descriptionEn : service.descriptionBn}</CardDescription></div></CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="rounded-xl bg-muted/60 p-4"><p className="font-semibold">{english ? service.sectionEn : service.sectionBn}</p><div className="mt-3 grid gap-2 sm:grid-cols-2">{service.fields.map((field) => <div key={field.name} className="rounded-lg border bg-card px-3 py-2 text-sm"><span className="text-muted-foreground">{english ? field.labelEn : field.labelBn}</span>{field.required && <span aria-hidden="true"> *</span>}</div>)}</div></div>
          <p className="text-sm leading-6 text-muted-foreground">{english ? "Service requests are reviewed and coordinated by agriculture operations staff. Sending a request does not create an order or payment." : "কৃষি পরিচালনা দল সেবার অনুরোধ যাচাই ও সমন্বয় করবে। অনুরোধ জমা দিলে অর্ডার বা পেমেন্ট তৈরি হয় না।"}</p>
          <div className="flex flex-wrap gap-3"><Link href={`/login?next=${encodeURIComponent(returnTo)}`} className={cn(buttonVariants(), "gap-2")}>{english ? "Sign in to request" : "অনুরোধ করতে লগইন করুন"}<ArrowRightIcon data-icon="inline-end" /></Link><Link href={`${routeBase}/market`} className={buttonVariants({ variant: "outline" })}>{english ? "Browse marketplace" : "মার্কেটপ্লেস দেখুন"}</Link></div>
        </CardContent>
      </Card>
    </main>
  );
}
