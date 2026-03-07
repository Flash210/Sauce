import { test, expect, Page } from '@playwright/test';
import data from './fixture/testdata.json';

async function login(page: Page) {
  await page.goto(data.baseUrl);
  await page.fill('#user-name', data.credentials.username);
  await page.fill('#password', data.credentials.password);
  await page.click('#login-button');
  await expect(page).toHaveURL(`${data.baseUrl}/inventory.html`);
}

test.beforeEach(async ({ page }) => {
  await login(page);
});

test('verify Add to cart button changes on double click', async ({ page }) => {
  const firstProduct = page.locator('.inventory_item').first();
    
  const addToCartButton = firstProduct.getByRole('button', { name: 'Add to cart' });
  const removeButton = firstProduct.getByRole('button', { name: 'Remove' });

  await expect(addToCartButton).toBeVisible();
  
  await addToCartButton.click();
  await expect(removeButton).toBeVisible();

  await removeButton.click();
  await expect(addToCartButton).toBeVisible();
});