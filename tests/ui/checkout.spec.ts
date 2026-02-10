import { test, expect } from '@playwright/test';

test.describe('Checkout', () => {
  test('start checkout from cart; verify checkout flow initiates (do not submit payment)', async ({ page }) => {
    await page.goto('/');

    // 1) Go to catalog (reliable entry point)
    await page.getByRole('link', { name: /catalog/i }).first().click();
    await expect(page).toHaveURL(/\/collections\/all/i);

    // 2) Open first product
    const firstProduct = page.locator('a[href*="/products/"]').first();
    await expect(firstProduct, 'Expected at least one product link in catalog.').toBeVisible();
    await firstProduct.click();

    // 3) Add to cart (and try to wait for the add-to-cart network call if it exists)
    const addToCart = page.getByRole('button', { name: /add to cart/i });
    await expect(addToCart).toBeVisible();

    await Promise.all([
      // Some themes call /cart/add.js or /cart/add; if we don't see it, don't hard-fail.
      page
        .waitForResponse((r) => r.url().includes('/cart/add') && r.status() >= 200 && r.status() < 400, {
          timeout: 15000,
        })
        .catch(() => null),
      addToCart.click(),
    ]);

    // 4) Go to cart and verify checkout control exists
    await page.goto('/cart', { waitUntil: 'domcontentloaded' });

    // On this theme (per your DOM), checkout is: <input type="submit" id="checkout" name="checkout" value="Check Out">
    const checkoutSubmit = page.locator('input#checkout');
    await expect(
      checkoutSubmit,
      'Expected checkout submit input#checkout to be visible on cart page (cart should be non-empty).'
    ).toBeVisible({ timeout: 15000 });

    // 5) Click checkout and confirm checkout flow initiates (network signal is more reliable than URL)
    await Promise.all([
      page.waitForRequest((req) => req.url().includes('/checkout'), { timeout: 15000 }),
      checkoutSubmit.click(),
    ]);

    // Optional: if navigation happens, assert URL contains checkout (do not hard-fail if demo blocks redirects)
    await page.waitForURL(/checkout/i, { timeout: 15000 }).catch(() => {});

    // IMPORTANT: Do not submit payment / place an order.
    // This test stops once checkout initiates.
  });
});