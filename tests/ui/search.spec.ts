import { test, expect} from '@playwright/test';

test.describe('Search', () => {
    test('search for "jacket" shows results or a rendered results state', async ({page}) => {
        await page.goto('/');
        
    })
})