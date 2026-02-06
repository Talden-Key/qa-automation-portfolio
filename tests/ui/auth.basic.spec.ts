import { test, expect } from "@playwright/test";

test.describe("Auth (basic)", () => {
  test("Login: invalid credentials shows error and user remains unauthenticated", async ({
    page,
  }) => {
    await page.goto("/");

    // Open login
    await page
      .getByRole("link", { name: /log in/i })
      .first()
      .click();
    await expect(page).toHaveURL(/\/account\/login/i);

    // Fill invalid creds
    await page
      .getByRole("textbox", { name: /email address/i })
      .fill("not-a-real-user@example.com");
    await page
      .getByRole("textbox", { name: /password/i })
      .fill("wrong-password-123");

    // Submit and wait for page/network to settle (Shopify may re-render)
    await Promise.all([
      page.waitForLoadState("domcontentloaded"),
      page.getByRole("button", { name: /sign in|log in/i }).click(),
    ]);

    // Assert user is still unauthenticated (primary contract)
    await expect(page).toHaveURL(/\/account\/login/i);

    await expect(page.getByRole("link", { name: /log in/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /log out/i })).toHaveCount(0);
    await expect(page.getByRole("link", { name: /account/i })).toHaveCount(0);
    // Remain unauthenticated
    await expect(page.getByRole("link", { name: /log in/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /log out/i })).toHaveCount(0);
    await expect(page.getByRole("link", { name: /account/i })).toHaveCount(0);
  });
  test('Register: create account page renders required fields', async ({page})=> {
    await page.goto('/account/register');

    // Open register/create account
    await expect(page).toHaveURL(/\/account\/register/i);

    // Required fields vary by theme, but Shopify register commonly includes:
    // FIrst name, Last name, Email, password
    // we'll assert the presence of core inputs by accessible name.
    const firstName = page.locator('input[name="customer[first_name]"]');
    const lastName  = page.locator('input[name="customer[last_name]"]');
    const email     = page.locator('input[name="customer[email]"]');
    const password  = page.locator('input[name="customer[password]"]');
    
    await expect(firstName).toBeVisible();
    await expect(lastName).toBeVisible();
    await expect(email).toBeVisible();
    await expect(password).toBeVisible();

    // And a submit button exists (Create / Register / Sign up)
    await expect(page.getByRole('button', { name: /create|register|sign up/i})).toBeVisible();
  })
});
