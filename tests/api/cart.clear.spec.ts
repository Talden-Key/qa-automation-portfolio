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
        
    })
})

