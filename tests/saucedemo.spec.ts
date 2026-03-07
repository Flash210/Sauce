import { test, expect } from "@playwright/test";
import data from "./fixture/testdata.json";
import { LoginPage } from "./pages/LoginPage";
import { InventoryPage } from "./pages/InventoryPage";
import { CartPage } from "./pages/CartPage";

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login(
    data.baseUrl,
    data.credentials.username,
    data.credentials.password
  );
});

test.afterEach(async ({ page }) => {
  console.log(`[afterEach] Test finished on: ${page.url()}`);
});

// ─────────────────────────────────────────────────────────────────────────────
// Test 1: Add ONE product and verify name, description and price in the cart
// ─────────────────────────────────────────────────────────────────────────────
test("Add one product and verify it in the cart", async ({ page }) => {
  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);

  const product = await inventoryPage.getProductDetails(0);
  await inventoryPage.addToCart(0);
  await inventoryPage.assertCartBadge(1);

  await inventoryPage.goToCart();
  await expect(page).toHaveURL(`${data.baseUrl}/cart.html`);

  await cartPage.assertProduct(product.name, product.desc, product.price);
});

// ─────────────────────────────────────────────────────────────────────────────
// Test 2: Add MULTIPLE products and verify each one in the cart
// ─────────────────────────────────────────────────────────────────────────────
test("Add multiple products and verify them in the cart", async ({ page }) => {
  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);
  const COUNT = 3;

  const products: { name: string; desc: string; price: string }[] = [];
  for (let i = 0; i < COUNT; i++) {
    products.push(await inventoryPage.getProductDetails(i));
    await inventoryPage.addToCart(i);
  }

  await inventoryPage.assertCartBadge(COUNT);

  await inventoryPage.goToCart();
  await expect(page).toHaveURL(`${data.baseUrl}/cart.html`);

  for (const product of products) {
    await cartPage.assertProduct(product.name, product.desc, product.price);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Test 3: "Add to cart" → button becomes "Remove" → click it → back to "Add to cart"
// ─────────────────────────────────────────────────────────────────────────────
test("Add to cart button toggles to Remove and back", async ({ page }) => {
  const inventoryPage = new InventoryPage(page);

  await inventoryPage.assertAddButtonVisible(0);

  await inventoryPage.addToCart(0);
  await inventoryPage.assertRemoveButtonVisible(0);
  await inventoryPage.assertAddButtonHidden(0);
  await inventoryPage.assertCartBadge(1);

  await inventoryPage.removeFromCart(0);
  await inventoryPage.assertAddButtonVisible(0);
  await inventoryPage.assertRemoveButtonHidden(0);
  await inventoryPage.assertCartBadgeHidden();
});
