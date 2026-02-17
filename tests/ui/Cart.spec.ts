import { test, expect } from "@playwright/test";

test.describe("Cart", () => {
  test("add a product to cart and verify cart shows a line item", async ({
    page,
  }) => {
    await page.goto("/");

    // Go to catalog first (more reliable than homepage for Shopify themes)
    await page
      .getByRole("link", { name: /catalog/i })
      .first()
      .click();
    await expect(page).toHaveURL(/\/collections\/all/i);

    // Open first product
    const firstProduct = page.locator('a[href*="/products/"]').first();
    await expect(
      firstProduct,
      "Expected at least one product link in catalog."
    ).toBeVisible();
    await firstProduct.click();

    // Add to cart (best-effort wait for /cart/add*)
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

    // Go to cart
    await page.goto("/cart", { waitUntil: "domcontentloaded" });

    // ✅ Non-empty cart signal for this theme: quantity input updates[]
    // Do NOT assert visibility (theme may render hidden inputs); assert existence.
    const qtyInputs = page.locator(
      'input[name="updates[]"], input[id^="updates_"]'
    );
    await expect(
      qtyInputs,
      "Expected at least one cart line item (updates[] input)."
    ).toHaveCount(2, {
      timeout: 15000,
    });
  });

  test("remove product; cart becomes empty (qty -> 0 + update)", async ({
    page,
  }) => {
    await page.goto("/");

    // Go to catalog
    await page
      .getByRole("link", { name: /catalog/i })
      .first()
      .click();
    await expect(page).toHaveURL(/\/collections\/all/i);

    // Open first product
    const firstProduct = page.locator('a[href*="/products/"]').first();
    await expect(firstProduct).toBeVisible();
    await firstProduct.click();

    // Add to cart (click ONCE)
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

    // Go to cart
    await page.goto("/cart", { waitUntil: "domcontentloaded" });

    // ✅ Line item exists: quantity input updates[]
    const qtyInputs = page.locator(
      'input[name="updates[]"], input[id^="updates_"]'
    );
    await expect(
      qtyInputs,
      "Expected at least one cart line item (updates[] input)."
    ).toHaveCount(2, {
      timeout: 15000,
    });

    // ✅ Set ALL qty inputs to 0 (theme may render duplicates for mobile/desktop)
    const n = await qtyInputs.count();
    for (let i = 0; i < n; i++) {
      await qtyInputs.nth(i).evaluate((el: HTMLInputElement) => {
        el.value = "0";
        el.dispatchEvent(new Event("input", { bubbles: true }));
        el.dispatchEvent(new Event("change", { bubbles: true }));
      });
    }

    // Click Update
    const updateBtn = page
      .locator('input[name="update"], button[name="update"], #update')
      .first();
    await expect(
      updateBtn,
      'Expected an "Update" control on cart page.'
    ).toBeVisible({ timeout: 15000 });
    await updateBtn.click();

    // Reload cart to get final state after server update
    await page.goto("/cart", { waitUntil: "domcontentloaded" });

    // ✅ Empty-cart success condition: either explicit empty message OR no updates[] inputs
    const emptyText = page
      .getByText(/your cart is empty|cart is empty|empty cart/i)
      .first();
    const qtyAfter = page.locator(
      'input[name="updates[]"], input[id^="updates_"]'
    );

    const emptySeen = await emptyText.isVisible().catch(() => false);
    const qtyCount = await qtyAfter.count();

    expect(
      emptySeen || qtyCount === 0,
      `Expected empty cart after update. emptyTextVisible=${emptySeen}, qtyInputsRemaining=${qtyCount}`
    ).toBeTruthy();
  });
});
