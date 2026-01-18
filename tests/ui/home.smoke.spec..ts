import {test, expect} from '@playwright/test';

test.describe('Home - smoke', () => {
    test('homepage loads and primary nav items are visible', async ({page}) => {
        await page.goto('/');

        // Basic "page is ready" signal
        await expect(page).toHaveTitle(/Sauce Demo/i);

        // Nav: prefer role=link with accessible names (most stable)
        const navNames = ['Search', 'About Us', 'Log In', 'Sign up'];
        
        for (const name of navNames) {
            await expect(page.getByRole('link', {name})).toBeVisible();
        }
    }


)
})