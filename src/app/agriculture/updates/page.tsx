import { connection } from "next/server";

import { AgriculturePublicInformationPage } from "@/components/agriculture/agriculture-public-information-page";
import { getPageMetadata } from "@/i18n/metadata";
import { getAgriculturePublicInfo } from "@/lib/agriculture/publishing";

export function generateMetadata() {
  return getPageMetadata("agricultureUpdates", "/agriculture/updates");
}
export const instant = false;

export default async function AgricultureUpdatesPage() {
  await connection();
  const info = await getAgriculturePublicInfo();
  return (
    <AgriculturePublicInformationPage info={info} routeBase="/agriculture" section="updates" />
  );
}
