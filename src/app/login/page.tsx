import { AuthPage } from "@/components/auth/auth-page";
import { safeNextPath } from "@/lib/dal";

export const instant = false;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const params = await searchParams;
  return <AuthPage mode="login" next={safeNextPath(params.next, "/account")} />;
}
