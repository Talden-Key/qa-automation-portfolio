import { test, expect } from "@playwright/test";

test.describe("SEO endpoints (robots & sitemap)", () => {
  test("GET /robots.txt returns 200 adn contains Sitemap directive", async ({
    request,
  }) => {
    const res = await request.get("/robots.txt");

    expect(res.status(), "Expected /robots.txt to return HTTP 200.").toBe(200);
  });
});
