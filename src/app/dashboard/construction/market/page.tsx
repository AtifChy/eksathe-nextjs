import { ConstructionMarketPage } from "@/components/construction/construction-market-page";

export const metadata = { alternates: { canonical: "/construction/market" } };
export const instant = false;

export default function DashboardMarketPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return <ConstructionMarketPage routeBase="/dashboard/construction" searchParams={searchParams} />;
}
