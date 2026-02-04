import { test, expect} from '@playwright/test';

test.describe('Search', () => {
    test('search for "jacket" shows results or a rendered results state', async ({page}) => {
        await page.goto('/');

        // Step 1: Navigate to search page (Shopify invariant: /search)
        await page.getByRole('link', {name: /search/i }).first().click();
        await expect(page).toHaveURL(/\/search/i);

        // Step 2: Enter search query
        const searchInput = page.getByRole('textbox', {name: /search/i});
        await expect(searchInput).toBeVisible();
        await searchInput.fill('jacket');

        // Submit search (Enter is more reliable than clicking icon)
        await searchInput.press('Enter');

        // Step 3: Assert results page rendered
        await expect(page).toHaveURL(/search/i);

        // Step 4: Assert a valid serach outcome
        // We accept ANY of the following as success:
        // - product reult links
        // - result grid/list rendered
        // - "no results" message rendered

        const resultSignals = [
            // Common Shopify pattern: product links
            page.locator('a[href*="/products/"]').first(),

            // Search result containers (varies by theme)
            page.locator('[id*="search"], [class*="search"]').first(),

            // Explicit noresults messageing
            page.getByText(/no results/i).first(),
            page.getByText(/results for/i).first(),
        ];

        let resultsRendered = false;
        for (const signal of resultSignals) {
            if (await signal.isVisible().catch(() => false)) {
                resultsRendered = true;
                break;
            }
        }

        expect(
            resultsRendered,
            'Expected search results page to render products or a valid empty-results state.'
        ).toBeTruthy();
    })
})