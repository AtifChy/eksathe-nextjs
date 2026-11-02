import type { Metadata } from "next";
import { connection } from "next/server";
import { AgricultureHome } from "@/components/agriculture/agriculture-home";
import { getPublicListings } from "@/lib/listings";
import { getAgriculturePublicInfo } from "@/lib/agriculture/publishing";

export const metadata: Metadata = { title: "Agriculture | EKsathe Bangladesh", description: "Agriculture services, marketplace listings, and support across Bangladesh.", alternates: { canonical: "/agriculture" } };
export const instant = false;

export default async function AgriculturePage() {
  await connection();
  const [result, publicInfo] = await Promise.all([getPublicListings("agriculture-labor"), getAgriculturePublicInfo()]);
  return <AgricultureHome routeBase="/agriculture" showDashboardBackLink={false} listings={result.items} unavailable={result.unavailable} publicInfo={publicInfo} />;
}
