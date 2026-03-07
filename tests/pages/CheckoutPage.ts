import { Page, expect } from "@playwright/test";

export class CheckoutPage {
  private checkoutBtn = '[data-test="checkout"]';
  private firstNameInput = '[data-test="firstName"]';
  private lastNameInput = '[data-test="lastName"]';
  private postalCodeInput = '[data-test="postalCode"]';
  private continueBtn = '[data-test="continue"]';
  private finishBtn = '[data-test="finish"]';
  private cancelBtn = '[data-test="cancel"]';
  private summaryTotal = ".summary_total_label";
  private summarySubtotal = ".summary_subtotal_label";
  private confirmationHeader = ".complete-header";
  private confirmationText = ".complete-text";
  private errorMessage = '[data-test="error"]';

  constructor(private page: Page) {}

  async proceedToCheckout() {
    await this.page.click(this.checkoutBtn);
    await expect(this.page).toHaveURL(/.*checkout-step-one\.html/);
  }

  async fillShippingInfo(
    firstName: string,
    lastName: string,
    postalCode: string
  ) {
    await this.page.fill(this.firstNameInput, firstName);
    await this.page.fill(this.lastNameInput, lastName);
    await this.page.fill(this.postalCodeInput, postalCode);
  }

  async clickContinue() {
    await this.page.click(this.continueBtn);
    await expect(this.page).toHaveURL(/.*checkout-step-two\.html/);
  }

  async clickFinish() {
    await this.page.click(this.finishBtn);
    await expect(this.page).toHaveURL(/.*checkout-complete\.html/);
  }

  async clickCancel() {
    await this.page.click(this.cancelBtn);
  }

  async assertOrderConfirmation() {
    await expect(this.page.locator(this.confirmationHeader)).toHaveText(
      "Thank you for your order!"
    );
    await expect(this.page.locator(this.confirmationText)).toContainText(
      "Your order has been dispatched"
    );
  }

  async assertSummarySubtotal(expectedText: string) {
    await expect(this.page.locator(this.summarySubtotal)).toContainText(
      expectedText
    );
  }

  async assertSummaryTotal() {
    await expect(this.page.locator(this.summaryTotal)).toBeVisible();
  }

  async assertErrorMessage(message: string) {
    await expect(this.page.locator(this.errorMessage)).toContainText(message);
  }
}
