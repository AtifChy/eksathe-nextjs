import { AdminWorkspace } from "@/components/admin/admin-workspace";
import { WorkspaceError } from "@/components/workflows/workspace-error";
import { getAdminWorkspace } from "@/lib/workspaces";
import { requireAdmin } from "@/lib/dal";

export const instant = false;

export default async function AdminPage() {
  const { access } = await requireAdmin();
  const data = await getAdminWorkspace(access).catch((error) => {
    console.error("Administration workspace query failed.", error);
    return null;
  });
  if (!data) return <WorkspaceError />;
  return <AdminWorkspace data={data} />;
}
