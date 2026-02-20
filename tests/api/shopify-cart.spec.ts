import {test, expect } from "@playwright/test";

test.describe("Shopify Ajax Cart API", () => {
    test("GET /cart.js returns cart JSON", async ({ request }) => {
        const  res = await request.get("/cart.js");
        expect(res.status()).toBe(200);

        const json = await res.json();
        expect(json).toHaveProperty("items");
        expect(json).toHaveProperty("item_count");
        expect(Array.isArray(json.items)).toBeTruthy();
    });

    test("POST /cart/clear.js empties the cart", async({ request })=> {
        const clearRes = await request.post("/cart/clear.js");
        expect(clearRes.status()).toBe(200);

        const cartRes = await request.get("/cart.js");
        expect(cartRes.status()).toBe(200);

        const cart = await cartRes.json();
        expect(cart.item_count).toBe(0);
        expect(cart.items.length).toBe(0);
    });

    test("GET /collections/all/products.json returns products array", async ({ request }) => {
        const res = await request.get("/collections/all/products.json?limit=10");
        expect(res.status()).toBe(200);

        const json = await res.json();
        expect(json).toHaveProperty("products");
        expect(Array.isArray(json.products)).toBeTruthy;
    })
})