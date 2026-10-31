export type Locale = "en" | "bn";

/** A single service-category hub shown on the dashboard grid */
export interface DashboardCategory {
  id: number;
  slug: string;
  icon: string;
  labelEn: string;
  labelBn: string;
}

export interface Dictionary {
  common: {
    brandName: string;
    brandSlogan: string;
    loading: string;
    currency: string;
  };
  header: {
    services: string;
    howItWorks: string;
    commissionCalculator: string;
    login: string;
    register: string;
    switchLanguage: string;
  };
  hero: {
    badge: string;
    titleLine1: string;
    titleLine2: string;
    description: string;
    browseServices: string;
    howItWorks: string;
    emergencyAssistance: string;
    emergencyNotice: string;
    categoriesCountLabel: string;
    serviceRequestsLabel: string;
    serviceRequestsValue: string;
    commissionLabel: string;
    commissionValue: string;
  };
  panels: {
    sectionTag: string;
    sectionTitle: string;
    sectionSubtitle: string;
    searchPlaceholder: string;
    searchAriaLabel: string;
    categoryAriaLabel: string;
    allCategories: string;
    noPanelsFound: string;
    viewDetailsAndRequest: string;
    submitRequestTitle: string;
    paymentNotice: string;
    categories: {
      agriculture: string;
      labor: string;
      market: string;
      finance: string;
      information: string;
      community: string;
    };
  };
  requestForm: {
    fullName: string;
    fullNamePlaceholder: string;
    phone: string;
    phonePlaceholder: string;
    district: string;
    districtPlaceholder: string;
    budget: string;
    budgetPlaceholder: string;
    details: string;
    detailsPlaceholder: string;
    submit: string;
    submitting: string;
    disclaimer: string;
    successTitle: string;
    successReference: string;
    successNotice: string;
  };
  howItWorks: {
    tag: string;
    title: string;
    steps: Array<{
      number: string;
      title: string;
      description: string;
    }>;
  };
  commission: {
    tag: string;
    title: string;
    description: string;
    amountLabel: string;
    platformShare: string;
    providerShare: string;
  };
  marketAndPolicy: {
    marketTag: string;
    marketTitle: string;
    feedSampleBadge: string;
    feedSampleTitle: string;
    feedSampleDescription: string;
    feedWarningBadge: string;
    feedWarningTitle: string;
    feedWarningDescription: string;
    policyTag: string;
    policyTitle: string;
    policies: string[];
  };
  emergency: {
    buttonLabel: string;
    modalTitle: string;
    modalSubtitle: string;
    modalDescription: string;
  };
  footer: {
    tagline: string;
    copyright: string;
  };
  dashboard: {
    tabDashboard: string;
    tabAdmin: string;
    demoNotice: string;
    searchPlaceholder: string;
    noResults: string;
    newsFeed: string;
    notifications: string;
    profile: string;
    emergencyCall: string;
    adminRole: string;
    guestRole: string;
    categories: DashboardCategory[];
  };
}
