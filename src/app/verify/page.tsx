import { AuthPage } from "@/components/auth/auth-page";
import { safeNextPath } from "@/lib/dal";

export default async function VerifyPage({ searchParams }: { searchParams: Promise<{ next?: string | string[] }> }) {
  const params = await searchParams;
  return <AuthPage mode="verify" next={safeNextPath(params.next, "/account")} />;
}
