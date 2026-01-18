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

        //Cart empty signal
        const possibleEmptyCartSignals = [
            page.getByText(/your cart is empty/i),
            page.getByRole('link', {name: /cart/i}),
            page.getByRole('button', {name: /cart/i}),
        ];

        let found = false;
        for (const locator of possibleEmptyCartSignals) {
            if (await locator.first().isVisible().catch(() => false)) {
                found = true;
                break;
            }
        }
        expect(found, 'Expected a visible cart indicator or "cart is empty" message.').toBeTruthy();
    }
)
})