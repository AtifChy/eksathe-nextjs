import { CategoryGrid } from "@/components/dashboard/category-grid";
import { DashboardTabs } from "@/components/dashboard/dashboard-tabs";
import { DashboardNotice } from "@/components/dashboard/dashboard-notice";

export const metadata = {
  title: "Dashboard | EKsathe Bangladesh",
  description:
    "Unified multi-sector category hub for EKsathe Bangladesh services and operations.",
};

export default function DashboardPage() {
  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 py-6 sm:py-8">
      <DashboardTabs />
      <DashboardNotice />
      <CategoryGrid />
    </div>
  );
}
