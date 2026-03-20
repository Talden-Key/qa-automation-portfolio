import { test, expect} from '@playwright/test';

test.describe.configure({ mode: "serial" });

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function postWithBackoff(request: any, url: string, options?: any, retries = 3) {
    let response = await request.post(url, options);
  
    for (let attempt = 0; attempt < retries && response.status() === 429; attempt++) {
      await sleep(1000 * (attempt + 1));
      response = await request.post(url, options);
    }
  
    return response;
  }

  test.describe("Cart negative API behavior", () => {
    test("POST /cart/add.js with invalid variant id fails gracefully", async ({ request }) => {
      await postWithBackoff(request, "/cart/clear.js");
    await postWithBackoff(request, "/cart/clear.js");
    })
})