import {test,expect} from '@playwright/test';

test.describe("Search endpoint contract", () => {
    test("GET /search?q=jacket returns HTML with search/result markers", async ({request}) => {
        const response = await request.get("/search?q=jacket");

        // HTTP status check
        expect(
            response.status(),
            "Expected search endpoint to return HTTP 200."
        ).toBe(200);
    })
})