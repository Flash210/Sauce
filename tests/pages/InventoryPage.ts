import { Page, expect } from "@playwright/test";

export class InventoryPage {
  private inventoryItem = ".inventory_item";
  private itemName = ".inventory_item_name";
  private itemDesc = ".inventory_item_desc";
  private itemPrice = ".inventory_item_price";
  private addToCartBtn = 'button[data-test^="add-to-cart"]';
  private removeBtn = 'button[data-test^="remove"]';
  private cartBadge = ".shopping_cart_badge";
  private cartLink = ".shopping_cart_link";

  constructor(private page: Page) {}

  async getProductDetails(index: number) {
    const item = this.page.locator(this.inventoryItem).nth(index);
    return {
      name: await item.locator(this.itemName).innerText(),
      desc: await item.locator(this.itemDesc).innerText(),
      price: await item.locator(this.itemPrice).innerText(),
    };
  }

  async addToCart(index: number) {
    const item = this.page.locator(this.inventoryItem).nth(index);
    await item.locator(this.addToCartBtn).click();
  }

  async removeFromCart(index: number) {
    const item = this.page.locator(this.inventoryItem).nth(index);
    await item.locator(this.removeBtn).click();
  }

  async assertCartBadge(count: number) {
    await expect(this.page.locator(this.cartBadge)).toHaveText(String(count));
  }

  async assertCartBadgeHidden() {
    await expect(this.page.locator(this.cartBadge)).not.toBeVisible();
  }

  async assertAddButtonVisible(index: number) {
    const item = this.page.locator(this.inventoryItem).nth(index);
    await expect(item.locator(this.addToCartBtn)).toBeVisible();
  }

  async assertRemoveButtonVisible(index: number) {
    const item = this.page.locator(this.inventoryItem).nth(index);
    await expect(item.locator(this.removeBtn)).toBeVisible();
  }

  async assertAddButtonHidden(index: number) {
    const item = this.page.locator(this.inventoryItem).nth(index);
    await expect(item.locator(this.addToCartBtn)).not.toBeVisible();
  }

  async assertRemoveButtonHidden(index: number) {
    const item = this.page.locator(this.inventoryItem).nth(index);
    await expect(item.locator(this.removeBtn)).not.toBeVisible();
  }

  async goToCart() {
    await this.page.click(this.cartLink);
  }
}
