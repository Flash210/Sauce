import { test, chromium, Browser } from "@playwright/test";
import data from "./fixture/testdata.json";
import { LoginPage } from "./pages/LoginPage";

let browser: Browser;

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login(
    data.baseUrl,
    data.credentials.username,
    data.credentials.password
  );
});

test.afterEach(async ({ page }, testInfo) => {
  const screenshotPath = `test-results/screenshots/${testInfo.title.replace(
    /\s+/g,
    "_"
  )}_${testInfo.status}.png`;

  await page.screenshot({ path: screenshotPath, fullPage: true });

  await testInfo.attach(
    testInfo.status === "passed"
      ? "✅ Screenshot on pass"
      : "❌ Screenshot on fail",
    {
      body: await page.screenshot({ fullPage: true }),
      contentType: "image/png",
    }
  );
});
