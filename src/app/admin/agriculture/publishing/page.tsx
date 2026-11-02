import { AgriculturePublishingWorkspace } from "@/components/admin/agriculture-publishing-workspace";
import { requireStaff } from "@/lib/dal";
import { getAgriculturePublishingWorkspace } from "@/lib/agriculture/publishing";

export const instant = false;

export default async function AgriculturePublishingPage() {
  const actor = await requireStaff("OPERATIONS", "agriculture-labor");
  const data = await getAgriculturePublishingWorkspace(actor);
  return <AgriculturePublishingWorkspace data={data} isSuperAdmin={actor.role === "super_admin"} />;
}
