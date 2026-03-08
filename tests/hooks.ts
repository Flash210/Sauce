import { test } from "@playwright/test";
import data from "./fixture/testdata.json";
import { LoginPage } from "./pages/LoginPage";
import * as fs from "fs";
import * as path from "path";

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login(data.credentials.username, data.credentials.password);
});

test.afterEach(async ({ page }, testInfo) => {
  // Take screenshot BEFORE the page is torn down
  const screenshot = await page.screenshot({ fullPage: true });

  // Save to disk
  const screenshotDir = "test-results/screenshots";
  fs.mkdirSync(screenshotDir, { recursive: true });
  const screenshotPath = path.join(
    screenshotDir,
    `${testInfo.title.replace(/\s+/g, "_")}_${testInfo.status}.png`
  );
  fs.writeFileSync(screenshotPath, screenshot);

  // Attach to the HTML report
  await testInfo.attach(
    testInfo.status === "passed"
      ? "✅ Screenshot on pass"
      : "❌ Screenshot on fail",
    {
      body: screenshot,
      contentType: "image/png",
    }
  );


});
