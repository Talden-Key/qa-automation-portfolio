import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';

test.describe('Catalog', () => {
  test('catalog page opens and product listing renders', async ({ page }) => {
    const home = new HomePage(page);

    await home.goto();
    await home.openCatalog();

    // Shopify-invariant: product links contain "/products/"
    const productLinks = page.locator('a[href*="/products/"]');
    await expect(productLinks.first()).toBeVisible();
  });
});