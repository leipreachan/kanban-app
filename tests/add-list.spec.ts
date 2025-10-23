import { expect } from '@playwright/test';
import { mainPageTest as test } from './fixtures/main-page';

test.describe('Kanban Board Functionality', () => {
  test('Add a New List', async ({ mainPage }) => {
    const page = mainPage;

    await test.step('Click the "Add List" button', async () => {
      await page.getByRole('button', { name: 'Add List' }).click();
    });
    
    await test.step('Enter the list name', async () => {
      await page.getByRole('textbox', { name: 'List title' }).fill('Test List');
    });
    
    await test.step('Click Save', async () => {
      await page.getByRole('button', { name: 'Add List' }).click();
    });
    
    await test.step('Verify the list appears on the board', async () => {
      // First, find the list container by its title
      const listContainer = page.getByText('Test List').first().locator('..').locator('..');
      
      // Verify the list title is visible
      await expect(listContainer.getByText('Test List')).toBeVisible();
      
      // Verify the task count shows (0)
      await expect(listContainer.getByText('(0)')).toBeVisible();
    });
  });
});