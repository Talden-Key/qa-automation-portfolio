import { test, expect } from "@playwright/test";

test.describe("Product variant validation", () => {
  test("cannot add product without selecting required variant", async ({
    page,
  }) => {
    await page
      .getByRole("link", { name: /catalog/i })
      .first()
      .click();
    await expect(page).toHaveURL(/\/collections\/all/i);

    const firstProduct = page.locator('a[href*=/products/"]').first();
    await expect(firstProduct).toBeVisible();
    await firstProduct.click();

    const addToCart = page.getByRole("button", { name: /add to cart/i });
    await expect(addToCart).toBeVisible();

    const variantSelects = page.locator(
      'select[name*="id"], select, input[type="radio"], .single-option-selector'
    );
    const variantSelectorCount = await variantSelects.count();

    test.skip(
      variantSelectorCount === 0,
      "This product does not appear to require variant selection."
    );

    const cartBeforeRes = await page.request.get("/cart.js");
    expect(cartBeforeRes.status()).toBe(200);
    const cartBefore = await cartBeforeRes.json();
    const itemCountBefore = cartBefore.item_count;

    await addToCart.click();
  });
});
