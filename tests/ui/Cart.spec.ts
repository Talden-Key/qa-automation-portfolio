import { test, expect } from "@playwright/test";

test.describe("Cart", () => {
  test("add a product to cart and verify it appears", async ({ page }) => {
    await page.goto("/");

    //  Go to catalog first (more reliable than homepage for Shopify themes)
    await page.getByRole("link", { name: /catalog/i }).click();
    await expect(page).toHaveURL(/\/collections\/all/i);

    //  Click first product link in the catalog grid.
    // Shopify product links usually contain "/products/"
    const firstProduct = page.locator('a[href*="/products/"]').first();
    await expect(
      firstProduct,
      "Expected at least one product link in catalog."
    ).toBeVisible();
    await firstProduct.click();

    // Add to cart
    const addToCart = page.getByRole("button", { name: /add to cart/i });
    await expect(addToCart).toBeVisible();
    await addToCart.click();

    //  Go to cart page (this theme shows "My Cart (0)" link pointing to "#", but "Check Out" points to /cart)
    // Prefer direct navigation for reliability:
    await page.goto("/cart");

    // Assert cart is non-empty / shows checkout controls
    await expect(page.getByText(/check out/i).first()).toBeVisible();
  });

  // Cart remove product
  test("remove product; cart becomes empty and checkout is not available", async ({
    page,
  }) => {
    await page.goto("/");

    await page.getByRole("link", { name: /catalog/i }).click();
    await expect(page).toHaveURL(/\/collections\/all/i);

    const firstProduct = page.locator('a[href*="/products/"]').first();
    await expect(firstProduct).toBeVisible();
    await firstProduct.click();

    // ✅ Capture productPath AFTER navigating to the product page
    const productPath = new URL(page.url()).pathname;
    expect(productPath).toMatch(/^\/products\//);

    const productTitle = page.locator('h1[itemprop="name"]');
    await expect(productTitle).toBeVisible();
    const productName = (await productTitle.innerText()).trim();

    await page.getByRole("button", { name: /add to cart/i }).click();

    await page.goto("/cart");

    await expect(page.getByText(/check out/i).first()).toBeVisible();
    const productLink = page
      .locator(
        `a[href*="${productPath}"]` // contains productPath anywhere in href (handles absolute + ?variant)
      )
      .first();

    await expect(
      productLink,
      `Expected cart to contain a link containing the product path: ${productPath}`
    ).toBeVisible();

    const removeCandidates = [
      page.getByRole("button", { name: /remove/i }),
      page.getByRole("link", { name: /remove/i }),
      page.getByText(/remove/i),
    ];

    let clicked = false;
    for (const c of removeCandidates) {
      const loc = c.first();
      if (await loc.isVisible().catch(() => false)) {
        await loc.click();
        clicked = true;
        break;
      }
    }
    expect(
      clicked,
      "Expected a visible Remove control in the cart."
    ).toBeTruthy();

    await expect(page.getByText(/check out/i).first()).toHaveCount(0);

    // ✅ Assert link to product is gone (more reliable than productName text)
    await expect(page.locator(`a[href^="${productPath}"]`)).toHaveCount(0);

    const emptySignals = [
      page.getByText(/your cart is empty/i),
      page.getByText(/cart is empty/i),
      page.getByText(/empty cart/i),
      page.getByRole("heading", { name: /cart/i }),
    ];

    let emptySeen = false;
    for (const s of emptySignals) {
      if (
        await s
          .first()
          .isVisible()
          .catch(() => false)
      ) {
        emptySeen = true;
        break;
      }
    }
    expect(
      emptySeen,
      "Expected an empty-cart state after removing the only item."
    ).toBeTruthy();
  });
});
