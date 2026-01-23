import { test, expect} from '@playwright/test';

test.describe('Cart', () => {
    test('add a product to cart and verify it appears', async ({page}) =>{
        await page.goto('/');

        // Step 1: Open a product from the homepage listing.
        // Prefer a known product name if it's stable, otherwise open the first product-looking link.
        const main = page.getByRole('main');

        const preferredProductName = 'Grey jacket';

        const preferredProductLink = main.getByRole('link', {name: new RegExp(preferredProductName, 'i')});
        const productGridFallback = main.getByRole('link').filter({ has: page.locator('img') }).first();

        if (await preferredProductLink.isVisible().catch(() => false)){
            await preferredProductLink.click();
        }else { 
            await productGridFallback.click();
        }

    })
})