"use client";

import { ProviderApplicationForm } from "@/components/provider/provider-application-form";
import { useLanguage } from "@/components/language-provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ProviderApplicationEntry() {
  const { locale, t } = useLanguage();
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{t.workflow.applyProvider}</CardTitle>
          <CardDescription>{locale === "bn" ? "একটি ব্যবসায়িক প্রোফাইল থেকে কৃষি বা নির্মাণ বিভাগে সেবা দেওয়ার জন্য আবেদন করুন। প্রশাসনিক দল আপনার সেবার সক্ষমতা পর্যালোচনা করবে।" : "Apply once to serve customers in agriculture or construction. The operations team will review your requested capabilities."}</CardDescription>
        </CardHeader>
        <CardContent><ProviderApplicationForm /></CardContent>
      </Card>
    </div>
  );
}
