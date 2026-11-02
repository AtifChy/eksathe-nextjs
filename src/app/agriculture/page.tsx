import type { Metadata } from "next";
import { AgricultureHome } from "@/components/agriculture/agriculture-home";
import { getPublicListings } from "@/lib/listings";

export const metadata: Metadata = { title: "Agriculture | EKsathe Bangladesh", description: "Agriculture services, marketplace listings, and support across Bangladesh.", alternates: { canonical: "/agriculture" } };

export default async function AgriculturePage() {
  const result = await getPublicListings("agriculture-labor");
  return <AgricultureHome routeBase="/agriculture" showDashboardBackLink={false} listings={result.items} unavailable={result.unavailable} />;
}
