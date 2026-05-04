import { test, expect } from "@playwright/test";

test.describe("Footer navigation", () => {
  test("footer links navigate to expected pages", async ({ page }) => {
    await page.goto("/");

    const footer = page.locator("footer, [role='contentinfo']").first();
    await expect(
      footer,
      "Expected footer/contentinfo region to exist."
    ).toBeVisible();

    // Footer Search link
    await footer.getByRole("link", { name: /search/i }).click();
    await expect(page).toHaveURL(/\/search/i);
    await expect(page.getByRole("textbox", { name: /search/i })).toBeVisible();

    // Return home
    await page.goto("/");
    
    // Re-query footer after navigation
    const footerAgain = page.locator("footer, [role='contentinfo']").first();

    // Footer About Us link
    await footerAgain.getByRole("link", { name: /about us/i }).click();
    await expect(page).toHaveURL(/\/pages\/about-us/i);
    await expect(page.getByText(/about us/i).first()).toBeVisible();

  });
});
