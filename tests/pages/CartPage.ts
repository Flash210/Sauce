import { Page, expect } from "@playwright/test";

export class CartPage {
  private cartItem = ".cart_item";
  private itemName = ".inventory_item_name";
  private itemDesc = ".inventory_item_desc";
  private itemPrice = ".inventory_item_price";

  constructor(private page: Page) {}

  async assertProduct(name: string, desc: string, price: string) {
    const cartItem = this.page.locator(this.cartItem).filter({
      has: this.page.locator(this.itemName, { hasText: name }),
    });
    await expect(cartItem.locator(this.itemName)).toHaveText(name);
    await expect(cartItem.locator(this.itemDesc)).toHaveText(desc);
    await expect(cartItem.locator(this.itemPrice)).toHaveText(price);
  }
}
