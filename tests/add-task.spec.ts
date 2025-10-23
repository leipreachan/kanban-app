import { expect } from '@playwright/test';
import { mainPageTest as test } from './fixtures/main-page';

test.describe('Kanban Board Functionality', () => {
  test('Add a New Task', async ({ mainPage }) => {
    // 1. Navigate to the Home page
    const page = mainPage;

    // 2. Click the "Add Task" button
    await page.getByRole('button', { name: 'Add Task' }).click();
    
    // 3. Enter task details (title: "Test Task")
    await page.getByRole('textbox', { name: 'Task description' }).fill('Test Task');
    
    // 4. Click "Save"
    await page.getByRole('button', { name: 'Add Task' }).click();
    
    // Verify the task appears on the board
    await expect(page.getByText('Test Task')).toBeVisible();
  });
});