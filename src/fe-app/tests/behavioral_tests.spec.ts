import { test, expect } from '@playwright/test';

test('test_check_task', async ({ page }) => {
  await page.goto('http://localhost:4200/');
  await page.getByRole('button', { name: 'Go To Login' }).click();
  await page.getByRole('textbox', { name: 'Username:' }).click();
  await page.getByRole('textbox', { name: 'Username:' }).fill('admin');
  await page.getByRole('textbox', { name: 'Username:' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password:' }).fill('admin');
  await page.getByRole('textbox', { name: 'Password:' }).press('Enter');
  await page.locator('app-task').filter({ hasText: 'CSCE490The Third Final of' }).getByRole('checkbox').check();
  await page.getByRole('button', { name: '✔' }).click();
  await page.locator('app-task').filter({ hasText: 'CSCE490The Third Final of' }).getByRole('checkbox').uncheck();
  await page.getByRole('button', { name: '✔' }).click();
  await page.locator('div').filter({ hasText: /^The Third Final of Neverending Questions$/ }).click();
  await page.getByText('CSCE490 The Third Final of').click();
});

test('test_calendar', async ({ page }) => {
  await page.goto('http://localhost:4200/');
  await page.getByRole('button', { name: 'Go To Login' }).click();
  await page.getByRole('textbox', { name: 'Username:' }).click();
  await page.getByRole('textbox', { name: 'Username:' }).fill('admin');
  await page.getByRole('textbox', { name: 'Username:' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password:' }).fill('admin');
  await page.getByRole('textbox', { name: 'Password:' }).press('Enter');
  await page.getByRole('link', { name: 'task list icon' }).click();
  await page.getByRole('link', { name: 'calendar icon' }).click();
  await page.getByRole('heading', { name: 'MONDAY' }).click();
  await page.getByRole('button', { name: 'Next Week' }).click();
  await page.getByRole('button', { name: 'Previous Week' }).click();
  await page.getByRole('button', { name: 'Next Week' }).click();
  await page.getByRole('button', { name: 'Reset' }).click();
});

test('test_grades', async ({ page }) => {
  await page.goto('http://localhost:4200/');
  await page.getByRole('button', { name: 'Go To Login' }).click();
  await page.getByRole('textbox', { name: 'Username:' }).click();
  await page.getByRole('textbox', { name: 'Username:' }).fill('admin');
  await page.getByRole('textbox', { name: 'Username:' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password:' }).fill('admin');
  await page.getByRole('textbox', { name: 'Password:' }).press('Enter');
  await page.getByRole('link', { name: 'grades icon' }).click();
  await page.getByText('TEST ASSIGNMENT #').click();
  await page.getByText('N/A').nth(2).click();
});

test('test_settings_and_notif', async ({ page }) => {
  await page.goto('http://localhost:4200/');
  await page.getByRole('button', { name: 'Go To Login' }).click();
  await page.getByRole('textbox', { name: 'Username:' }).click();
  await page.getByRole('textbox', { name: 'Username:' }).fill('admin');
  await page.getByRole('textbox', { name: 'Username:' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password:' }).fill('admin');
  await page.getByRole('textbox', { name: 'Password:' }).press('Enter');
  await page.locator('header a').first().click();
  await page.getByText('Preferred Name:').click();
  await page.getByText('Update Password ◀').click();
  await page.getByText('Current Password:').click();
  await page.getByText('University Email', { exact: true }).click();
  await page.getByRole('checkbox', { name: 'University Email' }).check();
  await page.getByText('×').click();
  await page.locator('header a').nth(1).click();
  await page.getByRole('heading', { name: 'NOTIFICATIONS' }).click();
  await page.getByText('×').click();
});

test('test_add_delete', async ({ page }) => {
  await page.goto('http://localhost:4200/');
  await page.getByRole('button', { name: 'Go To Login' }).click();
  await page.getByRole('textbox', { name: 'Username:' }).click();
  await page.getByRole('textbox', { name: 'Username:' }).fill('admin');
  await page.getByRole('textbox', { name: 'Username:' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password:' }).fill('admin');
  await page.getByRole('textbox', { name: 'Password:' }).press('Enter');
  await page.getByRole('img', { name: 'add task icon' }).click();
  await page.getByRole('textbox', { name: 'Title:' }).click();
  await page.getByRole('textbox', { name: 'Title:' }).fill('delete');
  await page.getByRole('textbox', { name: 'Description:' }).click();
  await page.getByRole('textbox', { name: 'Description:' }).fill('delete');
  await page.getByRole('textbox', { name: 'Due Date:' }).fill('0001-01-01');
  await page.getByLabel('Course:').selectOption('67460db839c6b3085338aa81');
  await page.getByRole('button', { name: 'Save & Close' }).click();
  await page.getByRole('heading', { name: 'New Task Added:' }).click();
  await page.getByText('×').click();
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.locator('app-task').filter({ hasText: 'CSCE490deleteJan 1,' }).locator('a').nth(2).click();
});

test('test_classmate_navig', async ({ page }) => {
  await page.goto('http://localhost:4200/');
  await page.getByRole('button', { name: 'Go To Login' }).click();
  await page.getByRole('textbox', { name: 'Username:' }).click();
  await page.getByRole('textbox', { name: 'Username:' }).fill('admin');
  await page.getByRole('textbox', { name: 'Username:' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password:' }).fill('admin');
  await page.getByRole('textbox', { name: 'Password:' }).press('Enter');
  await page.getByRole('link', { name: 'calendar icon' }).click();
  await page.getByRole('img', { name: 'classmate icon' }).click();
  await page.getByText('COURSE').click();
});

test('test_wrong_password', async ({ page }) => {
  await page.goto('http://localhost:4200/');
  await page.getByRole('button', { name: 'Go To Login' }).click();
  await page.getByRole('textbox', { name: 'Username:' }).click();
  await page.getByRole('textbox', { name: 'Username:' }).fill('admin');
  await page.getByRole('textbox', { name: 'Username:' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password:' }).fill('wrongpassword');
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('textbox', { name: 'Password:' }).press('Enter');
});