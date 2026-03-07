import { Page, expect } from "@playwright/test";

export class LoginPage {
  private usernameInput = "#user-name";
  private passwordInput = "#password";
  private loginButton = "#login-button";

  constructor(private page: Page) {}

  async login(baseUrl: string, username: string, password: string) {
    await this.page.goto(baseUrl);
    await this.page.fill(this.usernameInput, username);
    await this.page.fill(this.passwordInput, password);
    await this.page.click(this.loginButton);
    await expect(this.page).toHaveURL(`${baseUrl}/inventory.html`);
  }
}
