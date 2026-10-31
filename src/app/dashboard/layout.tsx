import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/login");
  }

  const user = session.user as typeof session.user & {
    role?: string;
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <DashboardHeader
        userName={user.name}
        userRole={user.role}
      />
      <main className="flex-1">{children}</main>
    </div>
  );
}
