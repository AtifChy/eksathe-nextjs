import { ProviderApplicationEntry } from "@/components/provider/provider-application-entry";
import { ProviderWorkspace } from "@/components/provider/provider-workspace";
import { WorkspaceError } from "@/components/workflows/workspace-error";
import { getProviderWorkspace } from "@/lib/workspaces";
import { requireUser } from "@/lib/dal";

export const instant = false;

export default async function ProviderPage() {
  const user = await requireUser("/provider");
  const workspace = await getProviderWorkspace(user.id).catch((error) => {
    console.error("Provider workspace query failed.", error);
    return undefined;
  });
  if (workspace === undefined) return <WorkspaceError />;
  if (workspace === null) return <ProviderApplicationEntry />;
  return <ProviderWorkspace workspace={workspace} actorId={user.id} />;
}
