import { test, expect } from '@playwright/test';
import data from './fixture/testdata.json';


test('Complete checkout flow', async ({ page }) => {

  const firstItem = page.locator('.inventory_item').first();
  const productName = await firstItem.locator('.inventory_item_name').innerText();

  await firstItem.locator('button[data-test^="add-to-cart"]').click();

  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

  await page.click('.shopping_cart_link');
  await expect(page).toHaveURL('/cart.html');

  const cartItem = page.locator('.cart_item').first();
  await expect(cartItem.locator('.inventory_item_name')).toHaveText(productName);

  await page.click('[data-test="checkout"]');
  await expect(page).toHaveURL('/checkout-step-one.html');

  await page.fill('[data-test="firstName"]', 'Ali');
  await page.fill('[data-test="lastName"]', 'Marzoug');
  await page.fill('[data-test="postalCode"]', '3100');

  await page.click('[data-test="continue"]');
  await expect(page).toHaveURL('/checkout-step-two.html');

  await expect(page.locator('.inventory_item_name')).toHaveText(productName);

  await page.click('[data-test="finish"]');

  await expect(page).toHaveURL('/checkout-complete.html');
  await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
});