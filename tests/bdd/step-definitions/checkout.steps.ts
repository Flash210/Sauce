import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { PlaywrightWorld } from "../support/world";
import { LoginPage } from "../../pages/LoginPage";
import { InventoryPage } from "../../pages/InventoryPage";
import { CheckoutPage } from "../../pages/CheckoutPage";
import data from "../../fixture/testdata.json";

// ─────────────────────────────────────────────────────────────
// Background
// ─────────────────────────────────────────────────────────────

Given("I am logged in as a standard user", async function (this: PlaywrightWorld) {
  const loginPage = new LoginPage(this.page);
  await loginPage.login(data.credentials.username, data.credentials.password);
});

// ─────────────────────────────────────────────────────────────
// Cart steps
// ─────────────────────────────────────────────────────────────

Given("I add the first product to the cart", async function (this: PlaywrightWorld) {
  const inventoryPage = new InventoryPage(this.page);
  const product = await inventoryPage.getProductDetails(0);
  this.productPrice = product.price;
  await inventoryPage.addToCart(0);
});

Given("I navigate to the cart", async function (this: PlaywrightWorld) {
  const inventoryPage = new InventoryPage(this.page);
  await inventoryPage.goToCart();
  await expect(this.page).toHaveURL(/.*cart\.html/);
});

// ─────────────────────────────────────────────────────────────
// Checkout steps
// ─────────────────────────────────────────────────────────────

When("I proceed to checkout", async function (this: PlaywrightWorld) {
  const checkoutPage = new CheckoutPage(this.page);
  await checkoutPage.proceedToCheckout();
});

When(
  "I fill in my shipping information with {string} {string} {string}",
  async function (this: PlaywrightWorld, firstName: string, lastName: string, postalCode: string) {
    const checkoutPage = new CheckoutPage(this.page);
    await checkoutPage.fillShippingInfo(firstName, lastName, postalCode);
  }
);

When("I continue to the order summary", async function (this: PlaywrightWorld) {
  const checkoutPage = new CheckoutPage(this.page);
  await checkoutPage.clickContinue();
});

When("I finish the order", async function (this: PlaywrightWorld) {
  const checkoutPage = new CheckoutPage(this.page);
  await checkoutPage.clickFinish();
});

When(
  "I submit the checkout form without filling any field",
  async function (this: PlaywrightWorld) {
    await this.page.click('[data-test="continue"]');
  }
);

// ─────────────────────────────────────────────────────────────
// Assertion steps
// ─────────────────────────────────────────────────────────────

Then("I should see the order confirmation message", async function (this: PlaywrightWorld) {
  const checkoutPage = new CheckoutPage(this.page);
  await checkoutPage.assertOrderConfirmation();
});

Then("the subtotal should match the product price", async function (this: PlaywrightWorld) {
  const checkoutPage = new CheckoutPage(this.page);
  await checkoutPage.assertSummarySubtotal(this.productPrice);
});

Then(
  "I should see the error {string}",
  async function (this: PlaywrightWorld, message: string) {
    const checkoutPage = new CheckoutPage(this.page);
    await checkoutPage.assertErrorMessage(message);
  }
);
