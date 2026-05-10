import { test, expect } from "@playwright/test";

test.describe("Responsive sanity - mobile", () => {
  test.use({ viewport: { width: 375, height: 67 } });

  test("mobile layout shows menu and cart is accessible", async ({ page }) => {
    await page.goto("/");

    const menuCandidates = [
      page.getByRole("button", { name: /menu|open}navigation/i }),
      page.locator('button[aria-lable*="menu" i]'),
      page.locator('button[aria-controls*="menu" i]'),
    ];
    let menuButton: ReturnType<typeof page.locator> | null = null;

    for (const c of menuCandidates) {
      if (
        await c
          .first()
          .isVisible()
          .catch(() => false)
      ) {
        menuButton = c.first();
        break;
      }
    }

    // If no hamburger, fall back to visible nav  links (some thmemes keep them visible on mobile)
    if (menuButton) {
      await expect(
        menuButton,
        "Expected a visible mobile menu button."
      ).toBeVisible();
      await menuButton.click();

      // After opening menu, expect at least one nav link to be visible
      const navLink = page
        .getByRole("link", { name: /catalog|search|about/i })
        .first();
      await expect(
        navLink,
        "Expected navigation links to be visible after opening menu."
      ).toBeVisible();
    } else {
      // Fallback: header links are already visible
      await expect(
        page.getByRole("link", { name: /catalog|search|about/i }).first(),
        "Expected header navigation links to be visible on mobile."
      ).toBeVisible();
    }

    // Cart Acess
    // Common signals: "My Cart", "cart", or a checkout link pointing to /cart
    const cartLinkCandidates = [
      page.getByRole("link", { name: /my cart|cart/i }),
      page.locator('a[href*=" /cart"]').first(),
    ];

    let cartLink: ReturnType<typeof page.locator> | null = null;

    for (const c of cartLinkCandidates) {
      if (
        await c
          .first()
          .isVisible()
          .catch(() => false)
      ) {
        cartLink = c.first();
        break;
      }
    }
    expect(
      cartLink,
      "Expected a visible cart access point on mobile."
    ).not.toBeNull();

    await cartLink!.click();

    // Assert we reached the cart page
    await expect(page).toHaveURL(/\/cart/i);

    // Assert cart page renders (empty or not)
    const cartSignals = [
      page.getByText(/your cart|cart/i).first(),
      page.locator('input[name="updates[]"], input[id^="updates_"]').first(), // line items if present
      page.getByText(/check out/i).first(), // checkout control (may be hidden in some themes)
    ];

    let cartRendered = false;
    for (const s of cartSignals) {
      if (await s.isVisible().catch(() => false)) {
        cartRendered = true;
        break;
      }
    }

    expect(
      cartRendered,
      "Expected cart page to render on mobile."
    ).toBeTruthy();
  });
});
