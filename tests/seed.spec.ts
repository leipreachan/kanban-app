import { test as base, expect } from '@playwright/test';

const test = base.extend<{ mainPage: Page }>({
  mainPage: async ({ page }, use) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('button', { name: 'Add List' }).click();
    await page.getByRole('textbox', { name: 'List title' }).fill('main_list');
    await page.getByRole('button', { name: 'Add List' }).click();
    use(page);
  },
});

test.describe('Test group', () => {
  test('seed', async ({ mainPage }) => {
    await mainPage.goto('/');
  });
});
