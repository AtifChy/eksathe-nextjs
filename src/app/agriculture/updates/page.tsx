import type { Metadata } from "next";
import { connection } from "next/server";
import { AgriculturePublicInformationPage } from "@/components/agriculture/agriculture-public-information-page";
import { getAgriculturePublicInfo } from "@/lib/agriculture/publishing";

export const metadata: Metadata = { title: "Agriculture updates | EKsathe Bangladesh", alternates: { canonical: "/agriculture/updates" } };
export const instant = false;

export default async function AgricultureUpdatesPage() {
  await connection();
  const info = await getAgriculturePublicInfo();
  return <AgriculturePublicInformationPage info={info} routeBase="/agriculture" section="updates" />;
}
