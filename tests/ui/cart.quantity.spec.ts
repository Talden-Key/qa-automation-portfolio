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

    const qtyInputs = page.locator(
      'input[name="update[]"], input[id^="updates_"]'
    );
    const qtyCount = await qtyInputs.count();

    for (let i = 0; i < qtyCount; i++) {
      await qtyInputs.nth(i).evaluate((el: HTMLInputElement) => {
        el.value = "1";
        el.dispatchEvent(new Event("input", { bubbles: true }));
        el.dispatchEvent(new Event("change", { bubbles: true }));
      });
    }

    for (let i = 0; i < qtyCount; i++) {
      await qtyInputs.nth(i).evaluate((el: HTMLInputElement) => {
        el.value = "2";
        el.dispatchEvent(new Event("input", { bubbles: true }));
        el.dispatchEvent(new Event("change", { bubbles: true }));
      });
    }
    const updateBtn = page
      .locator('input[name="update"], button[name="update"], #update')
      .first();
    await expect(
      updateBtn,
      'Expected an "Update" control on cart page.'
    ).toBeVisible({ timeout: 15000 });
    await updateBtn.click();

    await page.goto("/cart", { waitUntil: "domcontentloaded" });

    const updatedQtyInputs = page.locator(
      'input[name="updates[]"], input[id^="updates_"]'
    );
    const updatedCount = await updatedQtyInputs.count();

    expect(
      updatedCount,
      "Expected quantity inputs to remain after quantity update."
    ).toBeGreaterThan(0);

    for (let i = 0; i < updatedCount; i++) {
      const value = await updatedQtyInputs.nth(i).inputValue();
      expect(value, `Expected quantity input ${i} to have value 2.`).toBe("2");
    }

    const cartRes = await page.request.get("/cart.js");
    expect(cartRes.status()).toBe(200);

    const cart = await cartRes.json();
    expect(
      cart.item_count,
      "Expected cart item_count to be 2 after quantity update."
    ).toBe(2);
  });
});
