import { test, expect } from "@playwright/test";

test.describe("Content pages availability", () => {
  test("GET /pages/about-us returns 200", async ({ request }) => {
    const res = await request.get("/pages/about-us");

    expect(res.status(), "Expected /pages/about-us to return HTTP 200.").toBe(
      200
    );
  });
});
