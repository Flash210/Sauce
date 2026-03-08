import { Page, expect } from "@playwright/test";

export class LoginPage {
  private usernameInput = "#user-name";
  private passwordInput = "#password";
  private loginButton = "#login-button";

  constructor(private page: Page) {}

  async login(username: string, password: string) {
    await this.page.goto("/");
    await this.page.fill(this.usernameInput, username);
    await this.page.fill(this.passwordInput, password);
    await this.page.click(this.loginButton);
    await expect(this.page).toHaveURL(/.*inventory\.html/);
  }
}
