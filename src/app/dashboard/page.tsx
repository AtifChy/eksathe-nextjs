import { CategoryGrid } from "@/components/dashboard/category-grid";
import { DashboardTabs } from "@/components/dashboard/dashboard-tabs";
import { DashboardNotice } from "@/components/dashboard/dashboard-notice";

export const metadata = {
  title: "Dashboard | EKsathe Bangladesh",
};

export default function DashboardPage() {
  return (
    <div className="mx-auto w-full max-w-screen-2xl px-4 py-6">
      <DashboardTabs />
      <DashboardNotice />
      <CategoryGrid />
    </div>
  );
}
