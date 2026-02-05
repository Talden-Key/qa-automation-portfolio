import {test, expect} from '@playwright/test';

test.describe('Auth (basic)', () => {
    test('Login: invalid credentials shows error and user remains unauthenticated', async ({page}) => {
        await page.goto('/');
        
    })
})