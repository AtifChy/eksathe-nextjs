import { AccountWorkspace } from "@/components/account/account-workspace";
import { WorkspaceError } from "@/components/workflows/workspace-error";
import { getCustomerWorkspace } from "@/lib/workspaces";
import { requireUser } from "@/lib/dal";
import { logError } from "@/lib/logging";

export const instant = false;

export default async function AccountPage() {
  const user = await requireUser("/account");
  const workspace = await getCustomerWorkspace(user.id).catch((error) => {
    logError("workspace.customer_query_failed", error);
    return null;
  });
  if (!workspace) return <WorkspaceError />;
  return <AccountWorkspace workspace={workspace} user={{ id: user.id, name: user.name, email: user.email, phone: user.phone }} />;
}
