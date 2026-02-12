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
    test('GET non-existent page returns 404', async ({ request }) => {
        const response = await request.get('/this-page-should-not-exist-qa-test');

        expect(
            response.status(),
            'Expected non-existent page to return HTTP 404.'
        ).toBe(404);
        
        // Sanity-check body conatin typical 404 signals
        const body = await response.text();
        expect(body.toLowerCase()).toContain('404');
    })
})