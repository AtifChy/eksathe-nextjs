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
    await expect(page.locator(`main a[href="/dashboard/${slug}"]`)).toHaveCount(1);
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

test("agriculture and construction expose their MVP service areas", async ({ page }) => {
  await page.goto("/dashboard/agriculture-labor");
  await expect(page.getByText("কৃষিপণ্যের বাজার").first()).toBeVisible();
  await expect(page.getByText("কৃষিশ্রমিক বুকিং").first()).toBeVisible();
  await expect(page.getByText("কৃষিযন্ত্র ভাড়া").first()).toBeVisible();

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
