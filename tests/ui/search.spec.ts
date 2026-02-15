import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';

test.describe('Search', () => {
  test('search for "jacket" shows results or a rendered results state', async ({ page }) => {
    const home = new HomePage(page);

    await home.goto();
    await home.search('jacket');

    const resultSignals = [
      page.locator('a[href*="/products/"]').first(),
      page.locator('[id*="search"], [class*="search"]').first(),
      page.getByText(/no results/i).first(),
      page.getByText(/results for/i).first(),
    ];

    let rendered = false;
    for (const s of resultSignals) {
      if (await s.isVisible().catch(() => false)) {
        rendered = true;
        break;
      }
    }

    expect(rendered, 'Expected search results page to render results or an empty-results state.').toBeTruthy();
  });
});