import { test, expect } from '@playwright/test';

test.describe('Auth - negative cases', () => {
    test('login with empty or invalid credentials show error and remains unauthenticated', async ({ page }) => {
        await page.goto('/');

        // step 1: Navigate to Login
        await page.getByRole('link', {name: /log in/i }).click();

        // sanity check: login page rendered
        await expect(page).toHaveURL(/login/i);

        // step 2: Submit epty form (most stable negative case)
        // shopify login forms usually have a submit button with "Sign in" or "Log in"
        const submitButton = page.getByRole('button', {
            name: /log in|sign in/i,
        });

        await expect(submitButton).toBeVisible();
        await submitButton.click();

        // step 3: Verify error state OR still unauthenticated 
        // Shopify themes vary widely in exact error text,
        // so we assert *behavioral signals instead of exact strings.

        const errorSignals = [
            //common inline error messages
            page.getByText(/incorrect|invalid|required|error/i),
            //Field-level validation messages
            page.getByText(/email.*required/i),
            page.getByText(/password.*required/i),

            //Global alert-style errors
            page.getByRole('alert'),
        ]

        let errorVisible = false;
        for (const locator of errorSignals) {
            if (await locator.first().isVisible().catch(() => false)) {
                errorVisible = true;
                break;
            }
        }

        expect( 
            errorVisible,
            'Expected an error message or validation feedback after invalid login attempt.'
        ).toBeTruthy();

        // Step 4: Verify  user remains unauthenticated
        // Strong signal: "Log In" link still visible
        await expect(page.getByRole('link', { name: /log in/i })).toBeVisible();

        // Weak but useful signal: no "Account", "Log out", or user menu
        const authenticatedSignals = [
            page.getByRole('link', { name: /account/i }),
            page.getByRole('link', { name: /log out/i }),
        ];

        for (const locator of authenticatedSignals) {
            await expect(locator).not.toBeVisible();
        }
    }
    )
})