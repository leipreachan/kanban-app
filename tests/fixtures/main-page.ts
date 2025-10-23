import { test as base, Page } from '@playwright/test';

export const mainPageTest = base.extend<{ mainPage: Page }>({
  mainPage: async ({ context }, use) => {
    const page = await context.newPage();
    await page.goto('/');
    await page.getByRole('button', { name: 'Add List' }).click();
    await page.getByRole('textbox', { name: 'List title' }).fill('main_list');
    await page.getByRole('button', { name: 'Add List' }).click();
    await use(page);
  },
});