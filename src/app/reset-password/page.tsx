import { AuthPage } from "@/components/auth/auth-page";

export const instant = false;

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string | string[] }>;
}) {
  const params = await searchParams;
  return (
    <AuthPage
      mode="reset"
      next="/account"
      token={Array.isArray(params.token) ? params.token[0] : params.token}
    />
  );
}
