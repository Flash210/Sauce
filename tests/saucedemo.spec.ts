import { test, expect } from "@playwright/test";
import data from "./fixture/testdata.json";

const locators = {
  // Login
  usernameInput: "#user-name",
  passwordInput: "#password",
  loginButton: "#login-button",
  // Inventory
  inventoryItem: ".inventory_item",
  itemName: ".inventory_item_name",
  itemDesc: ".inventory_item_desc",
  itemPrice: ".inventory_item_price",
  addToCartBtn: 'button[data-test^="add-to-cart"]',
  removeBtn: 'button[data-test^="remove"]',
  // Cart
  cartBadge: ".shopping_cart_badge",
  cartLink: ".shopping_cart_link",
  cartItem: ".cart_item",
};

test.beforeEach(async ({ page }) => {
  await page.goto(data.baseUrl);
  await page.fill(locators.usernameInput, data.credentials.username);
  await page.fill(locators.passwordInput, data.credentials.password);
  await page.click(locators.loginButton);
  await expect(page).toHaveURL(`${data.baseUrl}/inventory.html`);
});

test.afterEach(async ({ page }) => {
  console.log(`[afterEach] Test finished on: ${page.url()}`);
});

test("Add one product and verify it in the cart", async ({ page }) => {
  const firstItem = page.locator(locators.inventoryItem).first();

  const expectedName = await firstItem.locator(locators.itemName).innerText();
  const expectedDesc = await firstItem.locator(locators.itemDesc).innerText();
  const expectedPrice = await firstItem.locator(locators.itemPrice).innerText();

  await firstItem.locator(locators.addToCartBtn).click();
  await expect(page.locator(locators.cartBadge)).toHaveText("1");

  await page.click(locators.cartLink);
  await expect(page).toHaveURL(`${data.baseUrl}/cart.html`);

  const cartItem = page.locator(locators.cartItem).first();
  await expect(cartItem.locator(locators.itemName)).toHaveText(expectedName);
  await expect(cartItem.locator(locators.itemDesc)).toHaveText(expectedDesc);
  await expect(cartItem.locator(locators.itemPrice)).toHaveText(expectedPrice);
});

test("Add multiple products and verify them in the cart", async ({ page }) => {
  const COUNT = 3;
  const expectedProducts: { name: string; desc: string; price: string }[] = [];

  for (let i = 0; i < COUNT; i++) {
    const item = page.locator(locators.inventoryItem).nth(i);
    expectedProducts.push({
      name: await item.locator(locators.itemName).innerText(),
      desc: await item.locator(locators.itemDesc).innerText(),
      price: await item.locator(locators.itemPrice).innerText(),
    });
    await item.locator(locators.addToCartBtn).click();
  }

  await expect(page.locator(locators.cartBadge)).toHaveText(String(COUNT));

  await page.click(locators.cartLink);
  await expect(page).toHaveURL(`${data.baseUrl}/cart.html`);

  for (const product of expectedProducts) {
    const cartItem = page.locator(locators.cartItem).filter({
      has: page.locator(locators.itemName, { hasText: product.name }),
    });
    await expect(cartItem.locator(locators.itemName)).toHaveText(product.name);
    await expect(cartItem.locator(locators.itemDesc)).toHaveText(product.desc);
    await expect(cartItem.locator(locators.itemPrice)).toHaveText(
      product.price
    );
  }
});

test("Add to cart button toggles to Remove and back", async ({ page }) => {
  const firstItem = page.locator(locators.inventoryItem).first();
  const addButton = firstItem.locator(locators.addToCartBtn);
  const removeButton = firstItem.locator(locators.removeBtn);

  await expect(addButton).toBeVisible();

  await addButton.click();
  await expect(removeButton).toBeVisible();
  await expect(addButton).not.toBeVisible();
  await expect(page.locator(locators.cartBadge)).toHaveText("1");

  await removeButton.click();
  await expect(addButton).toBeVisible();
  await expect(removeButton).not.toBeVisible();
  await expect(page.locator(locators.cartBadge)).not.toBeVisible();
});
