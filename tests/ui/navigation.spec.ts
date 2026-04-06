import { test, expect} from '@playwright/test';

test.describe("Navigation consistency", ()=> {
    test("header navigation routes to the expected pages", async ({ page }) => {
        await page.goto("/");

        await page.getByRole("link", { name: /search/i }).first().click();
        await expect(page).toHaveURL(/\search/i);
        await expect(page.getByRole("textbox", { name: /search/i})).toBeVisible();

        await page.goto("/");
        await page.getByRole("link", { name: /about us/i }).first().click();
        await expect(page).toHaveURL(/\/pages\/about-us/i);
        await expect(page.getByText(/about us/i).first()).toBeVisible();

        await page.goto("/");
        await page.getByRole("link", { name: /blog/i }).first().click();
        await expect(page).toHaveURL(/\blogs\/news/i);
        await expect(page.getByText(/blog|news/i).first()).toBeVisible();


    })
})