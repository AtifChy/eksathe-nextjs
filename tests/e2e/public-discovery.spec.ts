import { expect, test } from "@playwright/test";

const sectors = [
  "family-household",
  "ecommerce-b2b",
  "repair-services",
  "agriculture-labor",
  "construction",
  "transport-bus",
  "tourism",
  "healthcare",
  "events",
  "isp-utility",
  "jobs-professionals",
  "social-feed",
  "payment-compliance",
];

test("the service hub links to all 13 sector panels", async ({ page }) => {
  await page.goto("/dashboard");
  for (const slug of sectors) {
    const route = slug === "agriculture-labor" ? "/dashboard/agriculture" : `/dashboard/${slug}`;
    await expect(page.locator(`main a[href="${route}"]`)).toHaveCount(1);
  }
});

test("the readiness endpoint reports database availability", async ({ request }) => {
  const response = await request.get("/api/health/ready");
  expect(response.status()).toBe(200);
  await expect(response.json()).resolves.toMatchObject({ status: "ready" });
});

test("planned sectors show a coming-soon page and unknown sectors return 404", async ({ page }) => {
  await page.goto("/dashboard/ecommerce-b2b");
  await expect(page.getByText("এই বিভাগে সেবা শিগগিরই চালু হবে।")).toBeVisible();
  const response = await page.goto("/dashboard/not-a-sector");
  expect(response?.status()).toBe(404);
});

test("agriculture routes share the prototype service directory and old routes redirect", async ({
  page,
}) => {
  await page.goto("/agriculture");
  await expect(page.getByRole("heading", { name: "কোন সেবাটি আপনার প্রয়োজন?" })).toBeVisible();
  await expect(page.getByRole("link", { name: /ফসল উৎপাদন ও চাষাবাদ/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /কৃষিশ্রমিক বুকিং/ })).toBeVisible();
  await expect(page.getByRole("link", { name: "ড্যাশবোর্ডে ফিরে যান" })).toHaveCount(0);

  await page.goto("/dashboard/agriculture");
  await expect(page.getByRole("heading", { name: "কোন সেবাটি আপনার প্রয়োজন?" })).toBeVisible();
  await expect(page.getByRole("link", { name: "ড্যাশবোর্ডে ফিরে যান" })).toHaveAttribute(
    "href",
    "/dashboard",
  );

  await page.goto("/dashboard/agriculture-labor?source=legacy");
  await expect(page).toHaveURL(/\/dashboard\/agriculture\?source=legacy$/);
});

test("agriculture service routes show specific form fields and unknown slugs return 404", async ({
  page,
}) => {
  await page.goto("/agriculture/services/crop-farming");
  await expect(page.getByText("জমির পরিমাণ", { exact: true })).toBeVisible();
  const response = await page.goto("/agriculture/services/not-a-service");
  expect(response?.status()).toBe(404);
});

test("agriculture marketplace keeps filters in the direct and dashboard URL contexts", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(
    "/agriculture/market?q=rice&category=grains&district=Dhaka&minPrice=10&maxPrice=100&sort=price-asc",
  );
  await expect(page.getByRole("heading", { name: "কৃষিপণ্য খুঁজুন" })).toBeVisible();
  await expect(page.getByRole("textbox", { name: "পণ্য বা বিক্রেতা খুঁজুন" })).toHaveValue("rice");
  await expect(page.getByLabel("বিভাগ")).toHaveValue("grains");
  await expect(page.getByLabel("জেলা")).toHaveValue("Dhaka");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByRole("heading", { name: "কৃষিপণ্য খুঁজুন" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await page.getByRole("button", { name: "EN", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Find farm products" })).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Search products or sellers" })).toHaveValue(
    "rice",
  );
  await page.getByRole("button", { name: "বাং", exact: true }).click();

  await page.goto("/dashboard/agriculture/market?category=fish");
  await expect(page.getByRole("heading", { name: "কৃষিপণ্য খুঁজুন" })).toBeVisible();
  await expect(page.getByRole("link", { name: "কৃষি সেবায় ফিরুন" })).toHaveAttribute(
    "href",
    "/dashboard/agriculture",
  );
  await expect(page.locator("form")).toHaveAttribute("action", "/dashboard/agriculture/market");
});

test("construction home shares content across canonical and dashboard entries", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("main a[href='/construction']")).toBeVisible();

  await page.goto("/construction");
  await expect(
    page.getByRole("heading", { name: "পরিকল্পনা করুন, সঠিক নির্মাণসেবা খুঁজে নিন।" }),
  ).toBeVisible();
  await expect
    .poll(() => page.evaluate(() => getComputedStyle(document.body).fontFamily))
    .toContain("Hind Siliguri");
  await expect(page.getByRole("link", { name: "ড্যাশবোর্ডে ফিরে যান" })).toHaveCount(0);
  await expect(page.locator("header a[href='/construction']")).toBeVisible();
  await expect(page.getByRole("link", { name: "ঠিকাদার ও নির্মাতা" })).toHaveAttribute(
    "href",
    "/construction/services/contractors",
  );

  await page.goto("/dashboard/construction");
  await expect(
    page.getByRole("heading", { name: "পরিকল্পনা করুন, সঠিক নির্মাণসেবা খুঁজে নিন।" }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "ড্যাশবোর্ডে ফিরে যান" })).toHaveAttribute(
    "href",
    "/dashboard",
  );
});

test("construction service directory routes and unknown slugs", async ({ page }) => {
  const services = [
    "contractors",
    "engineers",
    "architects",
    "masonry",
    "electrical",
    "plumbing",
    "painting-finishing",
    "building-materials",
  ];
  await page.goto("/construction");
  for (const slug of services) {
    await page.goto(`/construction/services/${slug}`);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("link", { name: /প্রকল্প তৈরি/ }).first()).toHaveAttribute(
      "href",
      `/account/projects/new?service=${slug}`,
    );
  }
  const response = await page.goto("/construction/services/not-a-service");
  expect(response?.status()).toBe(404);
});

test("construction marketplace keeps URL filters and route context", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(
    "/construction/market?type=CONSTRUCTION_SERVICE&district=Dhaka&minPrice=10&maxPrice=100&sort=price-asc&q=engineer",
  );
  await expect(page.getByRole("heading", { name: "নির্মাণ সেবা ও সামগ্রী খুঁজুন" })).toBeVisible();
  await expect
    .poll(() => page.evaluate(() => getComputedStyle(document.body).fontFamily))
    .toContain("Hind Siliguri");
  await expect(page.getByRole("textbox", { name: "সেবা, সামগ্রী বা সেবাদাতা খুঁজুন" })).toHaveValue(
    "engineer",
  );
  await expect(page.getByLabel("ধরন")).toHaveValue("CONSTRUCTION_SERVICE");
  await expect(page.getByLabel("জেলা")).toHaveValue("Dhaka");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );

  await page.getByRole("button", { name: "EN", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Find construction services and materials" }),
  ).toBeVisible();
  await expect
    .poll(() => page.evaluate(() => getComputedStyle(document.body).fontFamily))
    .toContain("Hind Siliguri");
  await expect(
    page.getByRole("textbox", { name: "Search services, materials, or providers" }),
  ).toHaveValue("engineer");

  await page.goto("/dashboard/construction/market?type=CONSTRUCTION_MATERIAL");
  await expect(
    page.getByRole("heading", { name: "Find construction services and materials" }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Back to construction services" })).toHaveAttribute(
    "href",
    "/dashboard/construction",
  );
  await expect(page.locator("form")).toHaveAttribute("action", "/dashboard/construction/market");
});

test("construction listing and provider details preserve direct and dashboard routes", async ({
  page,
}) => {
  await page.goto("/construction/listings/demo-listing-brick");
  await expect(page.getByText("প্রথম শ্রেণির লাল ইট", { exact: true })).toBeVisible();
  const listingImage = page.locator('[data-slot="listing-image"]').first();
  await expect(listingImage).toBeVisible();
  const cardTopPadding = await listingImage.evaluate(
    (image) => getComputedStyle(image.parentElement!).paddingTop,
  );
  expect(cardTopPadding).toBe("0px");
  await expect(page.getByRole("link", { name: "সেবাদাতার পরিচিতি" })).toHaveAttribute(
    "href",
    "/construction/providers/demo-construction-provider",
  );

  await page.goto("/dashboard/construction/listings/demo-listing-brick");
  await expect(page.getByText("প্রথম শ্রেণির লাল ইট", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "সেবাদাতার পরিচিতি" })).toHaveAttribute(
    "href",
    "/dashboard/construction/providers/demo-construction-provider",
  );

  await page.goto("/construction/providers/demo-construction-provider");
  await expect(page.getByText("নির্মাণ সাথী", { exact: true })).toBeVisible();
  await expect(page.locator("main a[href^='/construction/listings/']").first()).toBeVisible();

  await page.goto("/dashboard/construction/providers/demo-construction-provider");
  await expect(page.getByText("নির্মাণ সাথী", { exact: true })).toBeVisible();
  await expect(
    page.locator("main a[href^='/dashboard/construction/listings/']").first(),
  ).toBeVisible();
});

test("a customer workspace sends a guest to sign in with the destination preserved", async ({
  page,
}) => {
  await page.goto("/account");
  await expect(page).toHaveURL(/\/login\?next=/);
  await expect(page.getByLabel("ইমেইল")).toBeVisible();
});

test("a construction project keeps its selected service through guest sign-in", async ({
  page,
}) => {
  await page.goto("/account/projects/new?service=contractors");
  await expect(page).toHaveURL(/\/login\?next=/);
  const destination = new URL(page.url()).searchParams.get("next");
  expect(destination).toBe("/account/projects/new?service=contractors");
});

test("the sector hub switches to English at a mobile viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/dashboard");
  const search = page.getByPlaceholder("বিভাগ খুঁজুন");
  await expect
    .poll(() => search.evaluate((input) => getComputedStyle(input).backdropFilter))
    .toBe("none");
  await expect
    .poll(() =>
      search
        .locator("..")
        .locator("svg")
        .evaluate((icon) => getComputedStyle(icon).zIndex),
    )
    .toBe("10");
  await page.getByRole("button", { name: "EN", exact: true }).click();
  await expect(page.getByText("Family & Household")).toBeVisible();
  await expect(page.getByRole("link", { name: "Agriculture & Labor", exact: true })).toBeVisible();
});
