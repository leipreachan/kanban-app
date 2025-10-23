import { expect } from '@playwright/test';
import { mainPageTest as test } from './fixtures/main-page';

test.describe('Kanban Board Functionality', () => {
  test('Add a New Task', async ({ mainPage }) => {
    const page = mainPage;

    await test.step('Click the "Add Task" button', async () => {
      await page.getByRole('button', { name: 'Add Task' }).click();
    });
    
    await test.step('Enter task details', async () => {
      await page.getByRole('textbox', { name: 'Task description' }).fill('Test Task');
    });
    
    await test.step('Click Save', async () => {
      await page.getByRole('button', { name: 'Add Task' }).click();
    });
    
    await test.step('Verify the task appears on the board', async () => {
      // First verify the task is visible
      await expect(page.getByText('Test Task')).toBeVisible();
      
      // Find the list container with main_list (from fixture) and verify its count
      const mainList = page.getByText('main_list').first().locator('..');
      await expect(mainList.getByText('(1)')).toBeVisible();
    });
  });
});