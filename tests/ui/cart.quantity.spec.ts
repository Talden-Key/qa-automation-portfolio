import { test, expect } from "@playwright/test";

test.describe("Cart quantity update", () => {
  test("update cart quantity from 1 to 2", async ({ page }) => {
    await page.goto("/");

    await page
      .getByRole("link", { name: /catalog/i })
      .first()
      .click();
    await expect(page).toHaveURL(/\/collections\/all/i);

    const firstProduct = page.locator('a[href*="/products/"]').first();
    await expect(
      firstProduct,
      "Expected at least one product link in catalog."
    ).toBeVisible();
    await firstProduct.click();

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

    await page.goto("/cart", { waitUntil: "domcontentloaded" });

    const qtyInputs = page.locator('input[name="update[]"], input[id^="updates_"]');
    const qtyCount = await qtyInputs.count();

    for (let i = 0; i < qtyCount; i++) {
        await qtyInputs.nth(i).evaluate((el:HTMLInputElement) => {
            el.value = "1";
            el.dispatchEvent(new Event("input", { bubbles: true}));
            el.dispatchEvent(new Event("change", { bubbles: true}));
        })
    }

    for (let i = 0; i < qtyCount; i++) {
        await qtyInputs.nth(i).evaluate((el: HTMLInputElement) => {
          el.value = "2";
          el.dispatchEvent(new Event("input", { bubbles: true }));
          el.dispatchEvent(new Event("change", { bubbles: true }));
        });
      }
  });
});
