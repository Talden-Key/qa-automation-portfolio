import { expect, type Page } from "@playwright/test";

export class HomePage {
    constructor(private readonly page: Page) {}

    async goto() {
        await this.page.goto('/');
        await expect(this.page.getByRole('heading', { name: / sauce demo/i})).toBeVisible();
    }
    
    async openCatalog() {
        await this.page.getByRole('link', {name: /catalog/i }).first().click();
        await expect(this.page).toHaveURL(/\/collections\/all/i);
    }
    async search(query: string) {
        await this.page.getByRole('link', {name: /search/i}).first().click();
        await expect(this.page).toHaveURL(/\/search/i);

        const searchInput = this.page.getByRole('textbox', {name: /search/i });
        await expect(searchInput).toBeVisible();
        await searchInput.fill(query);
        await searchInput.press('Enter');

        await expect(this.page).toHaveURL(/\/search/i);
    }

    async openCart() {
        await this.page.goto('/cart');
        await expect(this.page).toHaveURL(/\/cart/i);
    }
}