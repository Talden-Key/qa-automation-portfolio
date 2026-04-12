import {test, expect } from "@playwright/test";

test.describe("Product variant validation", () => {
    test("cannot add product without selecting required variant", async ({ page }) => {
        
        await page.getByRole("link", { name: /catalog/i }).first().click();
        await expect(page).toHaveURL(/\/collections\/all/i);

        const firstProduct = page.locator('a[href*=/products/"]').first();
        await expect(firstProduct).toBeVisible();
        await firstProduct.click();
    })
})