"use client";

import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { ServiceRequestForm } from "@/components/agriculture/service-request-form";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { AgricultureService } from "@/lib/agriculture/service-registry";

export function AgricultureServiceDetail({ service, routeBase, customer, emailVerified }: { service: AgricultureService; routeBase: string; customer: { name: string; phone: string } | null; emailVerified: boolean }) {
  const { locale } = useLanguage();
  const english = locale === "en";

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6">
      <Link href={routeBase} className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeftIcon aria-hidden="true" className="size-4" />{english ? "All agriculture services" : "সব কৃষিসেবা"}</Link>
      <Card>
        <CardHeader className="gap-4 sm:flex-row sm:items-start"><span aria-hidden="true" className="text-5xl">{service.icon}</span><div><p className="text-sm font-semibold text-primary">{english ? service.titleEn : service.titleBn}</p><CardTitle className="mt-1 text-3xl">{english ? service.titleEn : service.titleBn}</CardTitle><CardDescription className="mt-3 max-w-3xl text-base leading-7">{english ? service.descriptionEn : service.descriptionBn}</CardDescription></div></CardHeader>
        <CardContent className="flex flex-col gap-6">
          <p className="text-sm leading-6 text-muted-foreground">{english ? "Service requests are reviewed and coordinated by agriculture operations staff. Sending a request does not create an order or payment." : "কৃষি পরিচালনা দল সেবার অনুরোধ যাচাই ও সমন্বয় করবে। অনুরোধ জমা দিলে অর্ডার বা পেমেন্ট তৈরি হয় না।"}</p>
          <ServiceRequestForm service={service} routeBase={routeBase} customer={customer} emailVerified={emailVerified} />
          <div className="flex flex-wrap gap-3"><Link href={`${routeBase}/market`} className={buttonVariants({ variant: "outline" })}>{english ? "Browse marketplace" : "মার্কেটপ্লেস দেখুন"}</Link></div>
        </CardContent>
      </Card>
    </main>
  );
}
