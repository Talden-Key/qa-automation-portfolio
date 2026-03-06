import { test, expect } from "@playwright/test";

test.describe.configure({mode: "serial"});

async function sleep(ms:number) {
    return new Promise((r) => setTimeout(r,ms));
}

async function postWithBackoff(request: any, url: string, retries = 3) {
    let response = await request.post(url);

    for (let attempt = 0; attempt < retries && response.status() === 429; attempt++) {
        await sleep(1000 * (attempt + 1));
        response = await request.post(url);
    }
    return response;
}

test.describe("Shopify Ajax Cart API - Clear Cart", () => {
    test("POST /cart/clear.js empties the cart", async ({ request }) => {
        // Clear the cart (handle rate limits)
        const clearRes = await postWithBackoff(request, "/cart/clear.js");

        expect(
            clearRes.status(),
            "Expected /cart/clear.js to succed (200)."
        ).toBe(200);

        // Verify cart state via /cart.js
        const cartRes = await request.get("/cart.js");
        expect(cartRes.status(), "Expected /cart.js to return 200.").toBe(200);

        const cart = await cartRes.json();

        expect( cart.item_count, "Expected cart.item_count to be 0 after clearing.").toBe(0);

        expect( cart.item.length, "Expected cart.items array to be empty after clearing.").toBe(0);
    })
})

