import { expect, type Page } from "@playwright/test";

export class HomePage {
    constructor(private readonly page: Page) {}

    async goto() {
        await this.page.goto('/');
        await expect(this.page.getByRole('heading', { name: / sauce demo/i})).toBeVisible();
    }
}