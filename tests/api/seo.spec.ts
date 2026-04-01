import { test, expect } from "@playwright/test";

test.describe("SEO endpoints (robots & sitemap)", () => {
  test("GET /robots.txt returns 200 adn contains Sitemap directive", async ({
    request,
  }) => {
    const res = await request.get("/robots.txt");

    expect(res.status(), "Expected /robots.txt to return HTTP 200.").toBe(200);

    const contentType = res.headers()["content-type"] || "";
    expect(contentType, "Expected robots.txt to be text content.").toMatch(
      /text\/plain|text\/html/i
    );
  });
  test("GET /sitemap.xml returns 200 and valid XML content", async ({
    request,
  }) => {
    const res = await request.get("/sitemap.xml");

    expect(res.status(), "Expected /sitemap.xml to return HTTP 200.").toBe(200);

    const contentType = res.headers()["content-type"] || "";

    expect( contentType, "Expected sitemap to be XML.").toMatch(/xml/i);
  });
});
