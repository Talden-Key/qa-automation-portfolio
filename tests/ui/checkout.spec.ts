import {test, expect} from '@playwright/test';

test.describe('Checkout', () => {
    test(' start checkout from cart; checkout page renders (do not submit payment)', async ({ page }) => {
        await page.goto('/');

        // add 1 item to cart via Catalog (most reliable on Shopify themes) 
        await page.getByRole('link', { name: /catalog/i }).first().click();
        await expect(page).toHaveURL(/\/collections\/all/i);

        const firstProduct = page.locator('a[href*="/products/"]').first();
        await expect(firstProduct).toBeVisible();
        await firstProduct.click();

        const addToCart = page.getByRole('button', { name: /add to cart/i });
        await expect(addToCart).toBeVisible();
        await addToCart.click();

        
    })
})