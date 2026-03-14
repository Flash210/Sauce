import { test, expect } from '@playwright/test';
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


test('Verify button behavior when double clicking', async ({ page }) => {

  const firstItem = page.locator('.inventory_item').first();
  const addButton = firstItem.locator('button[data-test="add-to-cart"]');
  const removeButton = firstItem.locator('button[data-test="remove"]');

  await expect(addButton).toBeVisible();

  await addButton.click();

  await expect(removeButton).toBeVisible();
  await expect(page.locator('shopping_cart_link')).toHaveText('1');

  await removeButton.click();
  await expect(addButton).toBeVisible();
  await expect(page.locator('shopping_cart_link')).not.toBeVisible();

});

/*test('Add one product and verify it in the cart', async ({ page }) => {


  const firstItem = page.locator('.inventory_item').first();
  const expectedName = await firstItem.locator('.inventory_item_name').innerText();
  const expectedDesc = await firstItem.locator('.inventory_item_desc').innerText();
  const expectedPrice = await firstItem.locator('.inventory_item_price').innerText();

  await firstItem.locator('button[data-test^="add-to-cart"]').click();

  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

  await page.click('.shopping_cart_link');
  await expect(page).toHaveURL(`${URL}/cart.html`);

  const cartItem = page.locator('.cart_item').first();
  await expect(cartItem.locator('.inventory_item_name')).toHaveText(expectedName);
  await expect(cartItem.locator('.inventory_item_desc')).toHaveText(expectedDesc);
  await expect(cartItem.locator('.inventory_item_price')).toHaveText(expectedPrice);
});





test('Add multiple products and verify them in the cart', async ({ page }) => {


  const items = page.locator('.inventory_item');
  const count = 3; 

 
  const expectedProducts: { name: string; desc: string; price: string }[] = [];

  for (let i = 0; i < count; i++) {
    const item = items.nth(i);
    expectedProducts.push({
      name: await item.locator('.inventory_item_name').innerText(),
      desc: await item.locator('.inventory_item_desc').innerText(),
      price: await item.locator('.inventory_item_price').innerText(),
    });
    await item.locator('button[data-test^="add-to-cart"]').click();
  }

  await expect(page.locator('.shopping_cart_badge')).toHaveText(String(count));

  await page.click('.shopping_cart_link');
  await expect(page).toHaveURL(`${URL}/cart.html`);

  for (const product of expectedProducts) {
    const cartItem = page.locator('.cart_item').filter({
      has: page.locator('.inventory_item_name', { hasText: product.name }),
    });

    await expect(cartItem.locator('.inventory_item_name')).toHaveText(product.name);
    await expect(cartItem.locator('.inventory_item_desc')).toHaveText(product.desc);
    await expect(cartItem.locator('.inventory_item_price')).toHaveText(product.price);
  }
});


test('Add to cart button toggles to Remove and back', async ({ page }) => {


  const firstItem = page.locator('.inventory_item').first();
  const addButton = firstItem.locator('button[data-test^="add-to-cart"]');
  const removeButton = firstItem.locator('button[data-test^="remove"]');

  await expect(addButton).toBeVisible();

  await addButton.click();

  await expect(removeButton).toBeVisible();
  await expect(addButton).not.toBeVisible();

  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

  await removeButton.click();

  await expect(addButton).toBeVisible();
  await expect(removeButton).not.toBeVisible();

  await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();


  // Verify that the cart is empty
});*/
