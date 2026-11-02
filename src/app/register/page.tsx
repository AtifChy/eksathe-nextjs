import { AuthPage } from "@/components/auth/auth-page";
import { safeNextPath } from "@/lib/dal";

export const instant = false;

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ next?: string | string[] }> }) {
  const params = await searchParams;
  return <AuthPage mode="register" next={safeNextPath(params.next, "/account")} />;
}
