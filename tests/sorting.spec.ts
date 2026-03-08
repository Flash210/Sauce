import { test } from "@playwright/test";
import { SortingPage } from "./pages/SortingPage";
import "./hooks";

test.describe("Sorting Tests", () => {
  // ─────────────────────────────────────────────────────────────────────────────
  // Test 1: Products sorted A → Z (default)
  // ─────────────────────────────────────────────────────────────────────────────
  test("Products are sorted A to Z by default", async ({ page }) => {
    const sortingPage = new SortingPage(page);
    await sortingPage.assertActiveSortOption("az");
    await sortingPage.assertNamesSortedAZ();
    await sortingPage.assertPricesSortedLowToHigh();
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Test 2: Sort products Z → A
  // ─────────────────────────────────────────────────────────────────────────────
  test("Sort products Z to A", async ({ page }) => {
    const sortingPage = new SortingPage(page);
    await sortingPage.sortBy("za");
    await sortingPage.assertActiveSortOption("za");
    await sortingPage.assertNamesSortedZA();
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Test 3: Sort products by price low → high
  // ─────────────────────────────────────────────────────────────────────────────
  test("Sort products by price low to high", async ({ page }) => {
    const sortingPage = new SortingPage(page);
    await sortingPage.sortBy("lohi");
    await sortingPage.assertActiveSortOption("lohi");
    await sortingPage.assertPricesSortedLowToHigh();
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Test 4: Sort products by price high → low
  // ─────────────────────────────────────────────────────────────────────────────
  test("Sort products by price high to low", async ({ page }) => {
    const sortingPage = new SortingPage(page);
    await sortingPage.sortBy("hilo");
    await sortingPage.assertActiveSortOption("hilo");
    await sortingPage.assertPricesSortedHighToLow();
  });
});
