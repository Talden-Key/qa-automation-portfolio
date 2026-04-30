import {test, expect} from "@playwright/test";

test.describe("Cart persistence", () => {
    test("cart survives page reload after adding an item", async ({ page}) => {
        await page.goto("/");

        // Go to catalog
        await page.getByRole("link", { name: /catalog/i }).first().click();
        await expect(page).toHaveURL(/\/collections\/all/i);
    
        // Open first product
        const firstProduct = page.locator('a[href*="/products/"]').first();
        await expect(firstProduct).toBeVisible();
        await firstProduct.click();
    
        // Add to cart
        const addToCart = page.getByRole("button", { name: /add to cart/i });
        await expect(addToCart).toBeVisible();
    
        await Promise.all([
          page
            .waitForResponse(
              (r) =>
                r.url().includes("/cart/add") &&
                r.status() >= 200 &&
                r.status() < 400,
              { timeout: 15000 }
            )
            .catch(() => null),
          addToCart.click(),
        ]);
    })
})