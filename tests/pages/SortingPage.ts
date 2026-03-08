import { Page, expect } from "@playwright/test";

export type SortOption = "az" | "za" | "lohi" | "hilo";

export class SortingPage {
  private sortDropdown = '[data-test="product-sort-container"]';
  private itemName = ".inventory_item_name";
  private itemPrice = ".inventory_item_price";

  constructor(private page: Page) {}

  async sortBy(option: SortOption) {
    await this.page.selectOption(this.sortDropdown, option);
  }

  async getProductNames(): Promise<string[]> {
    return this.page.locator(this.itemName).allInnerTexts();
  }

  async getProductPrices(): Promise<number[]> {
    const rawPrices = await this.page.locator(this.itemPrice).allInnerTexts();
    return rawPrices.map((p) => parseFloat(p.replace("$", "")));
  }

  async assertNamesSortedAZ() {
    const names = await this.getProductNames();
    const sorted = [...names].sort();
    expect(names).toEqual(sorted);
  }

  async assertNamesSortedZA() {
    const names = await this.getProductNames();
    const sorted = [...names].sort().reverse();
    expect(names).toEqual(sorted);
  }

  async assertPricesSortedLowToHigh() {
    const prices = await this.getProductPrices();
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  }

  async assertPricesSortedHighToLow() {
    const prices = await this.getProductPrices();
    const sorted = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(sorted);
  }

  async assertActiveSortOption(option: SortOption) {
    await expect(this.page.locator(this.sortDropdown)).toHaveValue(option);
  }
}
