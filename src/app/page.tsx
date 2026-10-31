import { CommissionSection } from "@/components/landing/commission-section";
import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { MarketAndPolicySection } from "@/components/landing/market-and-policy-section";
import { PanelDirectory } from "@/components/landing/panel-directory";
import { getActivePanels } from "@/lib/panels";

export default async function Home() {
  const panels = await getActivePanels();

  return (
    <>
      <HeroSection totalPanels={panels.length} />
      <PanelDirectory panels={panels} />
      <HowItWorksSection />
      <CommissionSection />
      <MarketAndPolicySection />
    </>
  );
}
