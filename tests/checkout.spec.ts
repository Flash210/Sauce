import { test, expect } from "@playwright/test";
import data from "./fixture/testdata.json";
import { InventoryPage } from "./pages/InventoryPage";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import "./hooks";

test.describe("Checkout Tests", () => {
  // ─────────────────────────────────────────────────────────────────────────────
  // Test 1: Complete a full checkout flow and verify order confirmation
  // ─────────────────────────────────────────────────────────────────────────────
  test("Complete checkout and verify order confirmation", async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await inventoryPage.addToCart(0);
    await inventoryPage.goToCart();
    await expect(page).toHaveURL(/.*cart\.html/);

    await checkoutPage.proceedToCheckout();
    await checkoutPage.fillShippingInfo(
      data.checkout.firstName,
      data.checkout.lastName,
      data.checkout.postalCode
    );
    await checkoutPage.clickContinue();
    await checkoutPage.assertSummaryTotal();
    await checkoutPage.clickFinish();
    await checkoutPage.assertOrderConfirmation();
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Test 2: Verify order summary subtotal matches sum of added product prices
  // ─────────────────────────────────────────────────────────────────────────────
  test("Verify checkout summary subtotal is correct", async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const checkoutPage = new CheckoutPage(page);
    const COUNT = 2;

    let total = 0;
    for (let i = 0; i < COUNT; i++) {
      const product = await inventoryPage.getProductDetails(i);
      total += parseFloat(product.price.replace("$", ""));
      await inventoryPage.addToCart(i);
    }

    await inventoryPage.goToCart();
    await checkoutPage.proceedToCheckout();
    await checkoutPage.fillShippingInfo(
      data.checkout.firstName,
      data.checkout.lastName,
      data.checkout.postalCode
    );
    await checkoutPage.clickContinue();
    await checkoutPage.assertSummarySubtotal(`$${total.toFixed(2)}`);
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Test 3: Submitting checkout form with empty fields shows an error
  // ─────────────────────────────────────────────────────────────────────────────
  test("Checkout with empty fields shows validation error", async ({
    page,
  }) => {
    const inventoryPage = new InventoryPage(page);
    const checkoutPage = new CheckoutPage(page);

    await inventoryPage.addToCart(0);
    await inventoryPage.goToCart();
    await checkoutPage.proceedToCheckout();

    // Submit without filling any field
    await page.click('[data-test="continue"]');
    await checkoutPage.assertErrorMessage("First Name is required");
  });
});
