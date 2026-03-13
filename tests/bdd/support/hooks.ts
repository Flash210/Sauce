import { Before, After, ITestCaseHookParameter } from "@cucumber/cucumber";
import { PlaywrightWorld } from "./world";
import * as fs from "fs";
import * as path from "path";

Before(async function (this: PlaywrightWorld) {
  await this.openBrowser();
});

After(async function (this: PlaywrightWorld, scenario: ITestCaseHookParameter) {
  const screenshot = await this.page.screenshot({ fullPage: true });

  const status = scenario.result?.status ?? "unknown";
  const title = scenario.pickle.name.replace(/\s+/g, "_");

  // Save to disk
  const dir = "cucumber-test-results/screenshots";
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `${title}_${status}.png`), screenshot);

  // Attach inline to Cucumber HTML report
  await this.attach(screenshot, "image/png");

  await this.closeBrowser();
});
