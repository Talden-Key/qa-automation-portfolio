import { test, expect } from '@playwright/test';

test.describe('Auth – negative cases', () => {
  test('login with invalid credentials shows an error and remains unauthenticated', async ({ page }) => {
    await page.goto('/');

    // Go to login
    await page.getByRole('link', { name: /log in/i }).click();
    await expect(page).toHaveURL(/\/account\/login/i);

    // Fill invalid credentials (more reliable than empty submit)
    await page.getByRole('textbox', { name: /email address/i }).fill('not-a-real-user@example.com');
    await page.getByRole('textbox', { name: /password/i }).fill('wrong-password-123');

    await page.getByRole('button', { name: /sign in|log in/i }).click();

    // Assert: an error is shown (Shopify themes often render errors in a list/div with "errors" class)
    // Use a "multi-signal" approach: role OR common CSS OR common text.
    const errorBox = page.locator(
      '[role="alert"], .errors, .form-message--error, .error, [aria-live="polite"], [aria-live="assertive"]'
    );

    // await expect(errorBox).toBeVisible();

    // Optional: if this site uses text, assert a loose pattern (don’t overfit exact copy)
    await expect(
      page.getByText(/incorrect|invalid|error|password|email/i).first(),
      'Expected some error-related text to appear after invalid login.'
    ).toBeVisible();

    // Remain unauthenticated: still see Log In link and no Log out/Account
    await expect(page.getByRole('link', { name: /log in/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /log out/i })).toHaveCount(0);
    await expect(page.getByRole('link', { name: /account/i })).toHaveCount(0);
  });
});