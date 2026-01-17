import {test, expect} from '@playwright/test';

test.describe('Home - smoke', () => {
    test('homepage loads and primary nav items are visible', async ({page}) => {
        await page.goto('/');
    }
)
})