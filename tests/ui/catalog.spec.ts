import {test, expect } from '@playwright/test';
test.describe('Catalog', () => {
    test('catalog page opens and product listing renderss', async ({ page}) => {
        await page.goto('/');

        // Click "Catalog" in top nav (link name is usually stable)
        await page.getByRole('link', {name: 'Catalog'}).click();

        // we assert we navigaed away from hompage and the page loaded.
        await expect(page).not.toHaveURL(/\/$/);

        //we look for at least one product title/link insisde main content.
        const main = page.getByRole('main');

        // Prefer link cards (typical "product title" links). If theme differes, fallback to any product-like card.
        const productLinks = main.getByRole('link').filter({
            has: page.locator('img'),
        });

        await expect(productLinks.first(), 'Expected at least one tile/link with an img.').toBeVisible();
    });
});