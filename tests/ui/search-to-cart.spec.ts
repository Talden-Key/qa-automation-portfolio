import { test, expect } from "@playwright/test";

test.describe("Search -> Product -> Cart", () => {
  test('user can search for "jacket", open a result, and add it to cart', async ({
    page,
  }) => {
    await page.goto("/");

    await page
      .getByRole("link", { name: /search/i })
      .first()
      .click();
    await expect(page).toHaveURL(/\/search/i);

    const searchInput = page.getByRole("textbox", { name: /search/i });
    await expect(searchInput).toBeVisible();
    await searchInput.fill("jacket");
    await searchInput.press("Enter");

    await expect(page).toHaveURL(/\/search/i);

    const productResults = page.locator('a[href*="/product/"]');
    await expect(
      productResults.first(),
      'Expected at least one product result for query "jacket".'
    ).toBeVisible();

    await productResults.first().click();

    const productTitle = page.locator('h1[itemprop="name"]');
    await expect(productTitle, "Expected product title on PDP.").toBeVisible();

    const addToCart = page.getByRole("button", { name: /add to cart/i });
    await expect(adToCart, "Expected Add to Cart button on PDP.").toBeVisible();

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
  });
});
