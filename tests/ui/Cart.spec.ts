import { test, expect} from '@playwright/test';

test.describe('Cart', () => {
    test('add a product to cart and verify it appears', async ({page}) =>{
        await page.goto('/');
        
    })
})