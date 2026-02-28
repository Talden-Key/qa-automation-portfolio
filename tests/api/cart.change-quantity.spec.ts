import { test, expect } from '@playwright/test';

test.describe("Shopify Ajax Cart API - change quantity", () => {
    test("POST /cart/change.js updates quantity for an existing cart item", async ({ request }) => {
        // 1) Start clean
        const clear1 = await request.post("/cart/clear.js");
        expect(clear1.status(), "Expected /cart/clear.js to succeed").toBe(200);
        // 2) Get a live variant id (no hardcoding)
        const productsRes = await request.get("/collections/all/products.json?limit=10");
        expect(productsRes.status(), "Expected produts.json to return 200").toBe(200);

        const productsJson = await productsRes.json();
        expect(Array.isArray(productsJson.products)).toBeTruthy();
        expect(productsJson.products.length).toBeGreaterThan(0);

        const firstVariantId: number = productsJson.products[0].variants[0].id;
        expect(typeof firstVariantId).toBe("number");

        // 3) add item to cart (quantity 1)
        const addRes = await  request.post("/cart/add.js", {
            form: { id: String(firstVariantId), quantity: "1"},
        });
        expect([200, 302]).toContain(addRes.status());

        // 4) Get the line item key from /cart.js
        const cart1Res = await request.get("/cart.js");
        expect(cart1Res.status()).toBe(200);

        const cart1 = await cart1Res.json();
        expect(cart1.items.length).toBeGreaterThan(0);

        // Find the lie number (1-indexed) for our variant
        const idx = cart1.items.findIndex((it: any) => it.id === firstVariantId);
        expect(idx, 'Expected variant ${firstVariantID} to exist in cart before change. ').toBeGreaterThanOrEqual(0);

        const lineNumber = idx + 1;

        // 5) Change quantity to 2 via /cart/change.js
        const changeRes = await request.post("/cart/change.js", {
            form: {line: String(lineNumber), quantity:"2"},
        });

        expect(changeRes.status(), "Expected /cart/change.js to return 200").toBe(200);

        
    })
})