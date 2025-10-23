import { expect } from '@playwright/test';
import { mainPageTest as test } from './fixtures/main-page';

test.describe('Kanban Board Functionality', () => {
  test('Move Task Between Columns', async ({ mainPage }) => {
    const page = mainPage;
    
    await test.step('Add target list', async () => {
      await page.getByRole('button', { name: 'Add List' }).click();
      await page.getByRole('textbox', { name: 'List title' }).fill('Target List');
      await page.getByRole('button', { name: 'Add List' }).click();
    });
    
    await test.step('Add a task to the source list', async () => {
      const firstAddTaskButton = page.getByRole('button', { name: 'Add Task' }).first();
      await firstAddTaskButton.click();
      await page.getByRole('textbox', { name: 'Task description' }).fill('Test Task');
      await page.getByRole('button', { name: 'Add Task' }).first().click();
      
      // Verify task was added to the source list
      const sourceList = page.getByText('main_list').first().locator('..');
      await expect(sourceList.getByText('(1)')).toBeVisible();
    });
    
    await test.step('Move task to target list', async () => {
      await page.dragAndDrop('text=Test Task', 'text=Target List');
    });
    
    await test.step('Verify task movement', async () => {
      // Find both list headers
      const sourceList = page.getByText('main_list').first().locator('..');
      const targetList = page.getByText('Target List').first().locator('..');
      
      // Verify task counts in both lists
      await expect(sourceList.getByText('(0)')).toBeVisible();
      await expect(targetList.getByText('(1)')).toBeVisible();
      
      // Verify task appears under the target list
      await expect(page.getByText('Test Task')).toBeVisible();
    });
  });
});