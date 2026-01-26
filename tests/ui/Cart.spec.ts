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

        // Step 2: On PDP, click "Add to cart"
        // Shopify themes usually have a button name "Add to cart"
        const addToCart = page.getByRole('button', {name: /add to cart/i });
        await expect(addToCart).toBeVisible();
        await addToCart.click();

        // Step 3: Open cart.
        // Some themes open a drawer; some navigate to /cart.
        // we try: click a cart link/button, then accept either drawer or /cart.
        const cartTriggers = [
            page.getByRole('link', { name: /cart/i }),
            page.getByRole('button', { name: /cart/i }),
        ];

        let clicked = false;
        for (const trigger of cartTriggers) {
            if (await trigger.first().isVisible().catch(() => false)){
                await trigger.first().click();
                clicked = true;
                break;
            }
        }
        expect(clicked, 'Could not find a visible cart link/button to open cart.').toBeTruthy();

        // Step 4: Verify item is present in cart UI
        // If we used the preferred name, assert it; otherwise assert cart is non-empty.
        if (await page.getByTestId(new RegExp(preferredProductName, 'i')).first().isVisible().catch(() => false)) {
            await expect(page.getByText(new RegExp(preferredProductName, 'i')).first()).toBeVisible();
        } else {
            // Generic non-empty cart signals (themes vary)
            const nonEmptySignals = [
                page.getByTestId(/subtotal/i),
                page.getByRole('button', {name: /checkout/i }),
                page.getByText(/remove/i),
            ];

            let nonEmpty = false;
            for (const locator of nonEmptySignals) {
                if (await locator.first().isVisible().catch(() => false)) {
                    nonEmpty = true;
                    break;
                }
            }
            expect(nonEmpty, 'Expected cart to show non-empty state (subtotal/chekout/remove).').toBeTruthy();
        }
    })
})