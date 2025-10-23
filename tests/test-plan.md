# Kanban Board with Reports - Comprehensive Test Plan

## Application Overview

The "Kanban Board with Reports" application is a task management tool with the following key features:

- **Kanban Board**: Allows users to manage tasks visually.
- **Reports**: Provides insights and analytics on tasks.
- **Settings**: Enables users to configure board limits and manage data.
- **Navigation**: Facilitates movement between different sections of the app.

## Test Scenarios

### 1. Kanban Board Functionality

#### 1.1 Add a New List
**Steps:**
1. Navigate to the Home page.
2. Click the "Add List" button.
3. Enter the list name in the input field.
4. Click "Save" or press Enter.

**Expected Results:**
- A new list is added to the Kanban board.
- The list appears as a new column with no tasks.

#### 1.2 Add a New Task
**Steps:**
1. Navigate to the Home page.
2. Click the "Add Task" button.
3. Enter task details (e.g., title, description).
4. Click "Save".

**Expected Results:**
- The new task appears on the Kanban board.
- The task is displayed in the correct column.

#### 1.3 Move Task Between Columns
**Steps:**
1. Drag a task from one column to another.
2. Drop the task in the desired column.

**Expected Results:**
- The task is moved to the new column.
- The task's status is updated accordingly.

#### 1.4 Delete a Task
**Steps:**
1. Click the "Delete" icon on a task.
2. Confirm the deletion in the dialog.

**Expected Results:**
- The task is removed from the Kanban board.
- The task count is updated.

### 2. Reports Functionality

#### 2.1 View Reports
**Steps:**
1. Navigate to the Reports page.
2. Select a report type (e.g., task summary).
3. Click "Generate Report".

**Expected Results:**
- The report is displayed with accurate data.
- The report matches the selected type.

#### 2.2 Export Reports
**Steps:**
1. Generate a report.
2. Click the "Export" button.
3. Choose a file format (e.g., PDF, CSV).

**Expected Results:**
- The report is downloaded in the selected format.
- The file contains the correct data.

### 3. Settings Functionality

#### 3.1 Update Board Limits
**Steps:**
1. Navigate to the Settings page.
2. Locate the "Board Limits" section.
3. Change the limit values.
4. Click "Save".

**Expected Results:**
- The new limits are saved.
- The Kanban board reflects the updated limits.

#### 3.2 Clear Application Data
**Steps:**
1. Navigate to the Settings page.
2. Locate the "Data Manager" section.
3. Click "Clear Data".
4. Confirm the action.

**Expected Results:**
- All application data is cleared.
- The Kanban board is reset to its default state.

### 4. Navigation

#### 4.1 Navigate Between Pages
**Steps:**
1. Click on the "Home" link in the navigation bar.
2. Click on the "Reports" link in the navigation bar.
3. Click on the "Settings" link in the navigation bar.

**Expected Results:**
- The user is navigated to the correct page.
- The navigation bar highlights the active page.

### 5. General UI and Error Handling

#### 5.1 Responsive Design
**Steps:**
1. Open the application on different screen sizes (e.g., mobile, tablet, desktop).

**Expected Results:**
- The layout adjusts correctly for each screen size.
- All functionality remains accessible.

#### 5.2 Form Validation
**Steps:**
1. Attempt to save a task without entering a title.
2. Attempt to generate a report without selecting a type.

**Expected Results:**
- Appropriate error messages are displayed.
- The user cannot proceed until the errors are resolved.

---

This test plan ensures comprehensive coverage of the application's functionality, including happy paths, edge cases, and error handling scenarios.