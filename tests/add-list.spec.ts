import { expect } from '@playwright/test';
import { mainPageTest as test } from './fixtures/main-page';

test.describe('Kanban Board Functionality', () => {
  test('Add a New List', async ({ mainPage }) => {
    // 1. Navigate to the Home page
    const page = mainPage;

    // 2. Click the "Add List" button
    await page.getByRole('button', { name: 'Add List' }).click();
    
    // 3. Enter the list name
    await page.getByRole('textbox', { name: 'List title' }).fill('Test List');
    
    // 4. Click Save
    await page.getByRole('button', { name: 'Add List' }).click();
    
    // Verify the list appears on the board
    await expect(page.getByText('Test List')).toBeVisible();
    
    // Verify list has no tasks
    await expect(page.getByText('(0)')).toBeVisible();
  });
});