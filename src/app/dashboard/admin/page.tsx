import { DashboardTabs } from "@/components/dashboard/dashboard-tabs";
import { DashboardNotice } from "@/components/dashboard/dashboard-notice";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Admin Panel | EKsathe Bangladesh",
  description: "Management and overview of panels, requests, and transactions.",
};

export default async function AdminPage() {
  let panelCount = 0;
  let requestCount = 0;

  try {
    [panelCount, requestCount] = await Promise.all([
      prisma.panel.count(),
      prisma.serviceRequest.count(),
    ]);
  } catch {
    panelCount = 30;
    requestCount = 0;
  }

  const stats = [
    { label: "Active Panels", value: panelCount, hint: "Agricultural & multi-sector" },
    { label: "Service Requests", value: requestCount, hint: "Submitted from landing" },
    { label: "Commission Model", value: "10%", hint: "Official platform split" },
    { label: "Total Sectors", value: "13", hint: "Active category hubs" },
  ];

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 py-6 sm:py-8">
      <DashboardTabs />
      <DashboardNotice />

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border/70 bg-card p-5 shadow-xs">
            <span className="text-xs text-muted-foreground font-medium">{s.label}</span>
            <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">{s.value}</p>
            <span className="mt-1 text-xs text-muted-foreground/80">{s.hint}</span>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border/70 bg-card p-8 text-center shadow-xs">
        <h2 className="text-lg font-semibold text-foreground">Admin Workspace Active</h2>
        <p className="mt-2 text-sm text-muted-foreground max-w-lg mx-auto">
          Manage service requests, configure category panels, verify transactions, and monitor platform activity.
        </p>
      </div>
    </div>
  );
}
