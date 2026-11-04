import type { Metadata } from "next";
import { ConstructionMarketPage } from "@/components/construction/construction-market-page";

export const metadata: Metadata = { title: "Construction marketplace | EKsathe Bangladesh", alternates: { canonical: "/construction/market" } };
export const instant = false;

export default function MarketPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return <ConstructionMarketPage routeBase="/construction" searchParams={searchParams} />;
}
