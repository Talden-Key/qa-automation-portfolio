import { test, expect } from '@playwright/test';

test.describe('Catalog', () => {
  test('catalog page opens and product listing renders', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: 'Catalog' }).click();

    // stronger + clearer than "not /$"
    await expect(page).toHaveURL(/\/collections\/all/i);

    // robust assertion across Shopify themes
    const productLinks = page.locator('a[href*="/products/"]');
    await expect(
      productLinks.first(),
      'Expected at least one product link (href contains "/products/") on the catalog page.'
    ).toBeVisible();
  });
});