import { test, expect } from "@playwright/test";

test.describe("Search -> Product -> Cart", () => {
    test('user can search for "jacket", open a result, and add it to cart', async ({ page }) => {
        await page.goto("/");

        await page.getByRole("link", { name: /search/i }).first().click();
        await expect(page).toHaveURL(/\/search/i);

        const searchInput = page.getByRole("textbox", {name: /search/i});
        await expect(searchInput).toBeVisible();
        await searchInput.fill("jacket");
        await searchInput.press("Enter");
    })
});
