import { test, expect } from "@playwright/test";

test.describe("Product page contract", () => {
    test("product detail page renders required elements", async ({ page }) => {
        await page.goto("/");

        await page.getByRole("link", {name: /catalog/i }).click();
        await expect(page).toHaveURL(/\collections\/all/i);

        const firstProduct = page.locator('a[href*="/products/"]').first();
        await expect(firstProduct, "Expected at least one product link.").toBeVisible();
        await firstProduct.click();
    })
})