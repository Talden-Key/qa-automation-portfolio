import {test, expect} from '@playwright/test';

test.describe('Checkout', () => {
    test(' start checkout from cart; checkout page renders (do not submit payment)', async ({ page }) => {
        await page.goto('/');

        // add 1 item to cart via Catalog (most reliable on Shopify themes) 
        
    })
})