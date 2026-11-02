"use client";

import Link from "next/link";
import type { AgriculturePublicInfo } from "@/lib/agriculture/publishing";
import { useLanguage } from "@/components/language-provider";
import { AGRICULTURE_MARKET_PRICE_FRESHNESS_DAYS } from "@/lib/agriculture/publishing-constants";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function AgriculturePublicInformationPage({ info, routeBase, section }: { info: AgriculturePublicInfo; routeBase: string; section: "prices" | "updates" }) {
  const { locale } = useLanguage();
  const english = locale === "en";
  const date = (value: string) => new Intl.DateTimeFormat(english ? "en-BD" : "bn-BD", { dateStyle: "medium", timeZone: "Asia/Dhaka" }).format(new Date(value));
  const price = (value: string) => new Intl.NumberFormat(english ? "en-BD" : "bn-BD", { style: "currency", currency: "BDT", maximumFractionDigits: 2 }).format(Number(value));
  const isPrices = section === "prices";

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-7 px-4 py-8 sm:px-6 sm:py-12">
      <Link href={routeBase} className="w-fit text-sm font-medium text-primary hover:underline">{english ? "← All agriculture services" : "← সব কৃষিসেবা"}</Link>
      <header>
        <p className="text-sm font-semibold text-primary">{english ? "Verified agriculture information" : "যাচাইকৃত কৃষি তথ্য"}</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">{isPrices ? (english ? "Market prices" : "বাজারদর") : (english ? "News, advice, and alerts" : "খবর, পরামর্শ ও সতর্কতা")}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{isPrices ? (english ? `Prices include their market, district, unit, observation date, and source. Only prices observed within the last ${AGRICULTURE_MARKET_PRICE_FRESHNESS_DAYS} days are shown.` : `প্রতিটি দামে বাজার, জেলা, একক, পর্যবেক্ষণের তারিখ ও তথ্যসূত্র রয়েছে। গত ${AGRICULTURE_MARKET_PRICE_FRESHNESS_DAYS} দিনের মধ্যে পর্যবেক্ষিত দামই দেখানো হয়।`) : (english ? "Agriculture news, practical advice, and current weather alerts published by the operations team." : "পরিচালনা দল কর্তৃক প্রকাশিত কৃষি খবর, পরামর্শ ও চলমান আবহাওয়া সতর্কতা।")}</p>
      </header>

      {info.unavailable ? <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">{english ? "This information is temporarily unavailable. Please try again later." : "এই তথ্য সাময়িকভাবে পাওয়া যাচ্ছে না। পরে আবার চেষ্টা করুন।"}</p> : isPrices ? (
        info.prices.length === 0 ? <Empty text={english ? "No published market prices yet." : "এখনো কোনো বাজারদর প্রকাশিত হয়নি।"} /> :
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{info.prices.map((item) => <Card key={item.id}>
            <CardHeader><CardTitle>{english ? item.productEn : item.productBn}</CardTitle><CardDescription>{item.market} · {item.district}</CardDescription></CardHeader>
            <CardContent className="flex flex-col gap-2"><p className="text-xl font-bold text-primary">{price(item.price)} / {item.unit}</p><p className="text-sm text-muted-foreground">{english ? "Observed" : "পর্যবেক্ষণ"}: {date(item.observedAt)}</p><p className="text-sm text-muted-foreground">{english ? "Source" : "তথ্যসূত্র"}: {item.source}</p></CardContent>
          </Card>)}</div>
      ) : (
        info.updates.length === 0 ? <Empty text={english ? "No current updates or alerts." : "বর্তমানে কোনো আপডেট বা সতর্কতা নেই।"} /> :
          <div className="flex flex-col gap-4">{info.updates.map((item) => {
            const title = english ? item.titleEn : item.titleBn;
            const body = english ? item.bodyEn : item.bodyBn;
            const kind = item.kind === "NEWS" ? (english ? "News" : "খবর") : item.kind === "ADVICE" ? (english ? "Advice" : "পরামর্শ") : (english ? "Weather alert" : "আবহাওয়া সতর্কতা");
            return <Card key={item.id}>
              <CardHeader><div className="flex flex-wrap items-center gap-2"><Badge variant={item.kind === "WEATHER_ALERT" ? "destructive" : "secondary"}>{kind}</Badge><CardDescription>{english ? "Published" : "প্রকাশিত"}: {date(item.publishedAt)}</CardDescription></div><CardTitle>{title}</CardTitle></CardHeader>
              <CardContent className="flex flex-col gap-3"><p className="whitespace-pre-line text-sm leading-6">{body}</p><p className="text-sm text-muted-foreground">{english ? "Source" : "তথ্যসূত্র"}: {item.source}{item.expiresAt ? ` · ${english ? "Expires" : "মেয়াদ শেষ"}: ${date(item.expiresAt)}` : ""}</p></CardContent>
            </Card>;
          })}</div>
      )}
    </main>
  );
}

function Empty({ text }: { text: string }) {
  return <Card><CardContent className="p-8 text-sm text-muted-foreground">{text}</CardContent></Card>;
}
