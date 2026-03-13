import { IWorldOptions, World, setWorldConstructor, IWorld } from "@cucumber/cucumber";
import { Browser, BrowserContext, Page, chromium } from "@playwright/test";

export class PlaywrightWorld extends World implements IWorld {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;
  productPrice: string = "";

  constructor(options: IWorldOptions) {
    super(options);
  }

  async openBrowser() {
    this.browser = await chromium.launch({ headless: true });
    this.context = await this.browser.newContext({
      baseURL: "https://www.saucedemo.com",
    });
    this.page = await this.context.newPage();
  }

  async closeBrowser() {
    await this.context.close();
    await this.browser.close();
  }
}

setWorldConstructor(PlaywrightWorld);
