import { test, expect } from "@playwright/test";

test.describe("Product page contract", () => {
    test("product detail page renders required elements", async ({ page }) => {
        await page.goto("/");

        await page.getByRole("link", {name: /catalog/i }).click();
        await expect(page).toHaveURL(/\collections\/all/i);

        const firstProduct = page.locator('a[href*="/products/"]').first();
        await expect(firstProduct, "Expected at least one product link.").toBeVisible();
        await firstProduct.click();

        const title = page.locator('h1[itemprop="name"]');
        await expect(title, "Expected product title to be visible.").toBeVisible();

        await expect( page.getByText(/\$\s*\d+/), "Expected product price to be visible.").toBeVisible();

        const addToCart = page.getByRole("button", { name: /add to cart/i });
        await expect(addToCart, "Expected Add to Cart button.").toBeVisible();

        const productForm = page.locator('form[action*="/cart/add"]');
        await expect(productForm, "Expected product form for cart submission.").toBeVisible();

        const productImage = page.locator('img').first();
        await expect(productImage, "Expected product image to be visible.").toBeVisible();
    })
})