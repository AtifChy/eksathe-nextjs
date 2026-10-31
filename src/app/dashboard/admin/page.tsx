import { DashboardTabs } from "@/components/dashboard/dashboard-tabs";

export const metadata = {
  title: "Admin Panel | EKsathe Bangladesh",
};

export default function AdminPage() {
  return (
    <div className="mx-auto w-full max-w-screen-2xl px-4 py-6">
      <DashboardTabs />
      <p className="text-muted-foreground text-sm">Admin panel — coming soon.</p>
    </div>
  );
}
