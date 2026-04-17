import { test, expect } from "@playwright/test";

test.describe("Cart quantity update", () => {
    test('update cart quantity from 1 to 2', async ({ page }) => {
        await page.goto("/");

        await page.getByRole("link", {name: /catalog/i }).first().click();
        await expect(page).toHaveURL(/\/collections\/all/i);

        const firstProduct = page.locator('a[href*="/products/"]').first();
        await expect(firstProduct, "Expected at least one product link in catalog.").toBeVisible();
        await firstProduct.click();
    })
})