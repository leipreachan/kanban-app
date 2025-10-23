import { expect } from '@playwright/test';
import { mainPageTest as test } from './fixtures/main-page';

test.describe('Kanban Board Functionality', () => {
  test('Move Task Between Columns', async ({ mainPage }) => {
    // 1. Navigate to the Home page
    const page = mainPage;
    
    // 2. Add second list named "Target List"
    await page.getByRole('button', { name: 'Add List' }).click();
    await page.getByRole('textbox', { name: 'List title' }).fill('main_list');
    await page.getByRole('button', { name: 'Add List' }).click();
    
    await page.getByRole('button', { name: 'Add List' }).click();
    await page.getByRole('textbox', { name: 'List title' }).fill('Target List');
    await page.getByRole('button', { name: 'Add List' }).click();
    
    // 3. Add a task "Test Task" to the first list
    await page.getByRole('button', { name: 'Add Task' }).first().click();
    await page.getByRole('textbox', { name: 'Task description' }).fill('Test Task');
    await page.getByRole('button', { name: 'Add Task' }).first().click();
    
    // 4. Drag and drop the task
    const task = page.locator('text=Test Task').first();
    const targetList = page.locator('text=Target List').first();
    
    await page.dragAndDrop('text=Test Task', 'text=Target List');
    
    // Verify the task is moved
    await expect(page.getByText('Test Task')).toBeVisible();
    await expect(page.locator(':text("main_list") + :text("(0)")')).toBeVisible();
    await expect(page.locator(':text("Target List") + :text("(1)")')).toBeVisible();
  });
});