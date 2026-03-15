import { Page, expect } from "@playwright/test";

export class CheckoutPage2 {

  constructor(private page: Page) {}

  // LOCATORS
  private firstItem = ".inventory_item:first-child";
  private productName = ".inventory_item_name";
  private addToCartButton = 'button[data-test^="add-to-cart"]';
  private cartBadge = ".shopping_cart_badge";
  private cartIcon = ".shopping_cart_link";
  private cartItem = ".cart_item";
  private checkoutButton = '[data-test="checkout"]';

  private firstName = '[data-test="firstName"]';
  private lastName = '[data-test="lastName"]';
  private postalCode = '[data-test="postalCode"]';
  private continueButton = '[data-test="continue"]';

  private finishButton = '[data-test="finish"]';
  private orderMessage = ".complete-header";

  // METHODS

  async addFirstProductToCart() {
    const item = this.page.locator(this.firstItem);
    const name = await item.locator(this.productName).innerText();

    await item.locator(this.addToCartButton).click();

    await expect(this.page.locator(this.cartBadge)).toHaveText("1");

    return name;
  }

  async goToCart() {
    await this.page.click(this.cartIcon);
    await expect(this.page).toHaveURL(/cart/);
  }

  async verifyProductInCart(productName: string) {
    const cartItem = this.page.locator(this.cartItem).first();
    await expect(cartItem.locator(this.productName)).toHaveText(productName);
  }

  async startCheckout() {
    await this.page.click(this.checkoutButton);
    await expect(this.page).toHaveURL(/checkout-step-one/);
  }

  async fillCheckoutInformation(first: string, last: string, zip: string) {
    await this.page.fill(this.firstName, first);
    await this.page.fill(this.lastName, last);
    await this.page.fill(this.postalCode, zip);
    await this.page.click(this.continueButton);
  }

  async verifyCheckoutOverview(productName: string) {
    await expect(this.page).toHaveURL(/checkout-step-two/);
    await expect(this.page.locator(this.productName)).toHaveText(productName);
  }

  async finishOrder() {
    await this.page.click(this.finishButton);
  }

  async verifyOrderSuccess() {
    await expect(this.page).toHaveURL(/checkout-complete/);
    await expect(this.page.locator(this.orderMessage))
      .toHaveText("Thank you for your order!");
  }
}