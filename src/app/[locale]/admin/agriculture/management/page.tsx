import { notFound } from "next/navigation";

import { AgroAdminWorkspace } from "@/components/admin/agro-admin-workspace";
import { getAgricultureAdminWorkspace } from "@/lib/agriculture/admin";
import { requireAdmin } from "@/lib/dal";

export const instant = false;

export default async function AgricultureAdminManagementPage() {
  const { access } = await requireAdmin();
  const agricultureManagementEnabled = [
    ...access.userManagementSectors,
    ...access.panelManagementSectors,
    ...access.reportSectors,
  ].includes("agriculture-labor");
  if (!agricultureManagementEnabled) notFound();

  const data = await getAgricultureAdminWorkspace(access);
  return <AgroAdminWorkspace data={data} />;
}
