import { test, expect } from "@playwright/test";

test.describe("Checkout", () => {
  test(" start checkout from cart; checkout page renders (do not submit payment)", async ({
    page,
  }) => {
    await page.goto("/");

    // add 1 item to cart via Catalog (most reliable on Shopify themes)
    await page
      .getByRole("link", { name: /catalog/i })
      .first()
      .click();
    await expect(page).toHaveURL(/\/collections\/all/i);

    const firstProduct = page.locator('a[href*="/products/"]').first();
    await expect(firstProduct).toBeVisible();
    await firstProduct.click();

    const addToCart = page.getByRole("button", { name: /add to cart/i });
    await expect(addToCart).toBeVisible();
    await addToCart.click();

    // Go to cart
    await page.goto("/cart");

    // Click checkout (this theme uses "Check Out")
    const checkoutTrigger = page
      .getByRole("link", { name: /check\s*out|checkout/i })
      .or(page.getByRole("button", { name: /checkout\s*out|checkout/i }))
      .first();

    await expect(
      checkoutTrigger,
      "Expected a checkout button/link in the cart."
    ).toBeVisible();

    // Assert we're on a checkout-like page (Shopify typically uses /checkout or a checkout subdomain)
    await expect(page, "Expected to navigate to checkout.").toHaveURL(
      /checkout/i
    );

    // Assert checkout page rendered somthing meaningful.
    // Accept multiple possible signals because Shopify checkout
    const checkoutSignals = [
      page.getByText(/checkout/i).first(),
      page.getByText(/shipping/i).first(),
      page.getByText(/contact/i).first(),
      page.getByText(/payment/i).first(),
      page.getByText(/order summary/i).first(),
    ];

    let rendered = false;
    for (const s of checkoutSignals) {
      if (await s.isVisible().catch(() => false)) {
        rendered = true;
        break;
      }
    }
    expect(
      rendered,
      "Expected checkout page to render (shipping/contract/payment/ order summary)."
    ).toBeTruthy();
  });
});
