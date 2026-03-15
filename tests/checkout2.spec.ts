import { test } from "@playwright/test";
import { CheckoutPage2 } from "./pages/CheckoutPage2";
import data from "./fixture/testdata.json";

test("Complete checkout flow", async ({ page }) => {

  const checkout = new CheckoutPage2(page);

  await page.goto("https://www.saucedemo.com/inventory.html");

  const productName = await checkout.addFirstProductToCart();

  await checkout.goToCart();

  await checkout.verifyProductInCart(productName);

  await checkout.startCheckout();

  await checkout.fillCheckoutInformation("Ali", "Marzoug", "3100");

  await checkout.verifyCheckoutOverview(productName);

  await checkout.finishOrder();

  await checkout.verifyOrderSuccess();
});