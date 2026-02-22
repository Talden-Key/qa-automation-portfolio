import { test, expect } from "@playwright/test";

test.describe("Shopify Ajax Cart API = add item via live variant id", () => {
    test("POST /cart/add.js adds 1 item using a live variant id", async ({ request }) => {
        // 1) Strat clean
        const clear1 = await request.post("/cart/clear.js");
        expect(clear1.status(), "Expected/cart/clear.js to succedd").toBe(200);

        // 2) Get a live product + variant id (no hard coding) 
        const productsRes = await request.get("/collections/all/products.json?limit=10");
        expect(productsRes.status(), "Expected products.json to return 200").toBe(200);

        const productsJson = await productsRes.json();
        expect(Array.isArray(productsJson.products), "Expected products array").toBeTruthy();
        expect(productsJson.products.length, "Expected at least 1 products").toBeGreaterThan(0);

        const firstProduct = productsJson.products[0];
        expect(Array.isArray(firstProduct.variants), "Expected product.variants array").toBeTruthy();
        expect(firstProduct.variants.length, "Expected at least 1 variant").toBeGreaterThan(0);

        const variantId: number = firstProduct.variants[0].id;
        expect(typeof variantId, "Expected variant id to be number ").toBe("number");
    })
})