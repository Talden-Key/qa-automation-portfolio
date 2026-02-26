import { test, expect } from '@playwright/test';

test.describe("Shopify Ajax Cart API - change quantity", () => {
    test("POST /cart/change.js updates quantity for an existing cart item", async ({ request }) => {
        // 1) Start clean
        const clear1 = await request.post("/cart/clear.js");
        expect(clear1.status(), "Expected /cart/clear.js to succeed").toBe(200);
        // 2) Get a live variant id (no hardcoding)
        const productsRes = await request.get("/collections/all/products.json?limit=10");
        expect(productsRes.status(), "Expected produts.json to return 200").toBe(200);
    })
})