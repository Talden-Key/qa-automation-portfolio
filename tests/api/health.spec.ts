import {test, expect} from '@playwright/test';

test.describe('API Health Checks', () => {
    test('GET / returns 200 within acceptable response time', async ({ request }) => {
        const start = Date.now();
         
        const response = await request.get('/');
        
        const duration = Date.now() - start;

        // status check
        expect(response.status(), 'Expected homepage to return HTTP 200.').toBe(200);

        // Reponse time check (adjst threshold as needed)
        const MAX_RESPONSE_TIME_MS = 2000; // 2 seconds
        expect(
            duration, 'Expected homepage to respond within ${MAX_RESPONSE_TIME_MS}ms but took ${duration}ms.').toBeLessThan(MAX_RESPONSE_TIME_MS);
        
        // Basic content sanity check
        const body = await response.text();
        expect(body).toContain('<html');
    })
})