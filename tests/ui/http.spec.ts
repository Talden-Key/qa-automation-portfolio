import {test,expect} from '@playwright/test'

test.describe('HTTP / API-style checks', () => {
    test('GET / returns 200', async({request}) => {
        const response = await request.get('/');

        expect(response.status()).toBe(200);

        // Optional but strong signal: basic HTML sanity check
        const body = await response.text();
        expect(body.length).toBeGreaterThan(0);
        expect(body).toContain('<html');
    });
    test('GET /this-page-should-not-exist returns 404', async ({request})=> {
        const response = await request.get('/this-page-should-not-exist');

        expect(response.status()).toBe(404);
    });
});