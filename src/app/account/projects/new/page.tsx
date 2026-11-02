import { CreateProjectEntry } from "@/components/projects/create-project-entry";
import { requireUser } from "@/lib/dal";

export const instant = false;

export default async function CreateProjectPage() {
  await requireUser("/account/projects/new");
  return <CreateProjectEntry />;
}
