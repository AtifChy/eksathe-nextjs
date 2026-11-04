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

test("agriculture routes share the prototype service directory and old routes redirect", async ({ page }) => {
  await page.goto("/agriculture");
  await expect(page.getByRole("heading", { name: "কোন সেবাটি আপনার প্রয়োজন?" })).toBeVisible();
  await expect(page.getByRole("link", { name: /ফসল উৎপাদন ও চাষাবাদ/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /কৃষিশ্রমিক বুকিং/ })).toBeVisible();
  await expect(page.getByRole("link", { name: "ড্যাশবোর্ডে ফিরে যান" })).toHaveCount(0);

  await page.goto("/dashboard/agriculture");
  await expect(page.getByRole("heading", { name: "কোন সেবাটি আপনার প্রয়োজন?" })).toBeVisible();
  await expect(page.getByRole("link", { name: "ড্যাশবোর্ডে ফিরে যান" })).toHaveAttribute("href", "/dashboard");

  await page.goto("/dashboard/agriculture-labor?source=legacy");
  await expect(page).toHaveURL(/\/dashboard\/agriculture\?source=legacy$/);
});

test("agriculture service routes show specific form fields and unknown slugs return 404", async ({ page }) => {
  await page.goto("/agriculture/services/crop-farming");
  await expect(page.getByText("জমির পরিমাণ", { exact: true })).toBeVisible();
  const response = await page.goto("/agriculture/services/not-a-service");
  expect(response?.status()).toBe(404);
});

test("agriculture marketplace keeps filters in the direct and dashboard URL contexts", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/agriculture/market?q=rice&category=grains&district=Dhaka&minPrice=10&maxPrice=100&sort=price-asc");
  await expect(page.getByRole("heading", { name: "কৃষিপণ্য খুঁজুন" })).toBeVisible();
  await expect(page.getByRole("textbox", { name: "পণ্য বা বিক্রেতা খুঁজুন" })).toHaveValue("rice");
  await expect(page.getByLabel("বিভাগ")).toHaveValue("grains");
  await expect(page.getByLabel("জেলা")).toHaveValue("Dhaka");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByRole("heading", { name: "কৃষিপণ্য খুঁজুন" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.getByRole("button", { name: "EN", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Find farm products" })).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Search products or sellers" })).toHaveValue("rice");
  await page.getByRole("button", { name: "বাং", exact: true }).click();

  await page.goto("/dashboard/agriculture/market?category=fish");
  await expect(page.getByRole("heading", { name: "কৃষিপণ্য খুঁজুন" })).toBeVisible();
  await expect(page.getByRole("link", { name: "কৃষি সেবায় ফিরুন" })).toHaveAttribute("href", "/dashboard/agriculture");
  await expect(page.locator("form")).toHaveAttribute("action", "/dashboard/agriculture/market");
});

test("construction exposes its MVP service areas", async ({ page }) => {

  await page.goto("/dashboard/construction");
  await expect(page.getByText("নির্মাণসামগ্রী").first()).toBeVisible();
  await expect(page.getByText("নির্মাণ পেশাজীবী").first()).toBeVisible();
});

test("a customer workspace sends a guest to sign in with the destination preserved", async ({ page }) => {
  await page.goto("/account");
  await expect(page).toHaveURL(/\/login\?next=/);
  await expect(page.getByLabel("ইমেইল")).toBeVisible();
});

test("the sector hub switches to English at a mobile viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/dashboard");
  await page.getByRole("button", { name: "EN", exact: true }).click();
  await expect(page.getByText("Family & Household")).toBeVisible();
  await expect(page.getByRole("link", { name: "Agriculture & Labor", exact: true })).toBeVisible();
});
