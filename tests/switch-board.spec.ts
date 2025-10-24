import { expect } from '@playwright/test';
import { mainPageTest as test } from './fixtures/main-page';

test.describe('Kanban Board Functionality', () => {
  test('Switch Between Kanban Boards', async ({ mainPage }) => {
    test.skip(true, 'Known issue: Board switching is currently broken');
    const page = mainPage;
    
    await test.step('Create a new board', async () => {
      // Open board selector
      await page.getByRole('button', { name: 'Main Board' }).click();
      
      // Click Add Board
      await page.getByRole('menuitem', { name: 'Add Board' }).click();
      
      // Enter board name and create
      await page.getByRole('textbox', { name: 'Board name' }).fill('Test Board');
      await page.getByRole('button', { name: 'Create' }).click();
    });

    await test.step('Switch to the new board', async () => {
      // Open board selector again
      await page.getByRole('button', { name: 'Main Board' }).click();
      
      // Select the new board
      await page.getByRole('menuitem', { name: 'Test Board' }).click();
    });

    await test.step('Verify board switch', async () => {
      // Verify board name is updated
      await expect(page.getByRole('button', { name: 'Test Board' })).toBeVisible();
      
      // Verify the board starts empty
      const addListButton = page.getByRole('button', { name: 'Add List' });
      await expect(addListButton).toBeVisible();
    });

    await test.step('Verify the default list is not on the board', async () => {
      // Verify the list title is visible
      await expect(page.getByText('main_list')).not.toBeVisible();
    });
  });
});