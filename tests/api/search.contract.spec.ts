import {test,expect} from '@playwright/test';

test.describe("Search endpoint contract", () => {
    test("GET /search?q=jacket returns HTML with search/result markers", async ({request}) => {
        const response = await request.get("/search?q=jacket");

        // HTTP status check
        expect(
            response.status(),
            "Expected search endpoint to return HTTP 200."
        ).toBe(200);

        // Ensure response is HTML
        const contentType = response.headers()["content-type"];
        expect(
            contentType, "Expected search response to be HTML."
        ).toContain("text/html");

        const body = await response.text();
        // Validate search UI / result markers exist
    const markers = [
        /search/i,
        /results/i,
        /products/i,
        /jacket/i
      ];
  
      const foundMarker = markers.some((pattern) => pattern.test(body));
  
      expect(
        foundMarker,
        "Expected HTML to contain search or results indicators."
      ).toBeTruthy();
    })
})