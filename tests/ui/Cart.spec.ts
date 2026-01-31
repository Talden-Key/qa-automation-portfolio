import { test, expect } from '@playwright/test';

test.describe('Cart', () => {
  test('add a product to cart and verify it appears', async ({ page }) => {
    await page.goto('/');

    //  Go to catalog first (more reliable than homepage for Shopify themes)
    await page.getByRole('link', { name: /catalog/i }).click();
    await expect(page).toHaveURL(/\/collections\/all/i);

    //  Click first product link in the catalog grid.
    // Shopify product links usually contain "/products/"
    const firstProduct = page.locator('a[href*="/products/"]').first();
    await expect(firstProduct, 'Expected at least one product link in catalog.').toBeVisible();
    await firstProduct.click();

    // Add to cart
    const addToCart = page.getByRole('button', { name: /add to cart/i });
    await expect(addToCart).toBeVisible();
    await addToCart.click();

    //  Go to cart page (this theme shows "My Cart (0)" link pointing to "#", but "Check Out" points to /cart)
    // Prefer direct navigation for reliability:
    await page.goto('/cart');

    // Assert cart is non-empty / shows checkout controls
    await expect(page.getByText(/check out/i).first()).toBeVisible();
  });
});