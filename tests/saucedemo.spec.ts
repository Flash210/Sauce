import { test, expect } from '@playwright/test';

const URL = 'https://www.saucedemo.com';
const USERNAME = 'standard_user';
const PASSWORD = 'secret_sauce';

async function login(page) {
  await page.goto(URL);
  await page.fill('#user-name', USERNAME);
  await page.fill('#password', PASSWORD);
  await page.click('#login-button');
  await expect(page).toHaveURL(`${URL}/inventory.html`);
}


test('Add one product and verify it in the cart', async ({ page }) => {
  await login(page);

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
  await login(page);

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
  await login(page);

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
});
