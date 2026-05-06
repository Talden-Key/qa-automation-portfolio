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
  });
});
