import type { Metadata } from "next";
import { AgricultureMarketPage } from "@/components/agriculture/agriculture-market-page";

export const metadata: Metadata = { title: "Agriculture marketplace | EKsathe Bangladesh", alternates: { canonical: "/agriculture/market" } };
export const instant = false;

export default async function MarketPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return <AgricultureMarketPage routeBase="/agriculture" searchParams={searchParams} />;
}
