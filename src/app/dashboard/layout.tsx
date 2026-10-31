import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export const instant = false;

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  const user = session?.user as
    | {
        name?: string;
        role?: string;
      }
    | undefined;

  return (
    <div className="flex min-h-screen flex-col bg-[#f4f7f5] text-foreground dark:bg-background">
      <DashboardHeader
        userName={user?.name}
        userRole={user?.role ?? "admin"}
      />
      <main className="flex-1">{children}</main>
    </div>
  );
}
