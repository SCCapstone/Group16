import { test, expect } from '@playwright/test';

test('test_check_task', async ({ page }) => {
  await page.goto('http://localhost:4200/');
  await page.getByRole('button', { name: 'Go To Login' }).click();
  await page.getByRole('textbox', { name: 'Username:' }).click();
  await page.getByRole('textbox', { name: 'Username:' }).fill('admin');
  await page.getByRole('textbox', { name: 'Username:' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password:' }).fill('admin');
  await page.getByRole('textbox', { name: 'Password:' }).press('Enter');
  await page.locator('app-task').filter({ hasText: 'CSCE490Admin New Asssignment' }).getByRole('checkbox').check();
  await page.getByRole('button', { name: '✔' }).click();
  await page.getByRole('checkbox').uncheck();
  await page.getByRole('button', { name: '✔' }).click();
  await page.locator('div').filter({ hasText: /^Admin New Asssignment 1$/ }).click();
});

test('test_calendar', async ({ page }) => {
  await page.goto('http://localhost:4200/');
  await page.getByRole('button', { name: 'Go To Login' }).click();
  await page.getByRole('textbox', { name: 'Username:' }).click();
  await page.getByRole('textbox', { name: 'Username:' }).fill('admin');
  await page.getByRole('textbox', { name: 'Username:' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password:' }).fill('admin');
  await page.getByRole('button', { name: 'Login', exact: true }).click();
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
  await page.locator('div').filter({ hasText: /^CSCE490Admin New Asssignment 1F$/ }).locator('div').first().click();
  await page.locator('div').filter({ hasText: /^CSCE490Admin New Asssignment 1F$/ }).locator('#grade').click();
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
  await page.getByText('Update Password ▼').click();
  await page.getByText('University Email', { exact: true }).click();
  await page.getByText('University Email', { exact: true }).click();
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
  await page.getByRole('textbox', { name: 'Title:' }).fill('Test Assignment #12654');
  await page.getByRole('textbox', { name: 'Description:' }).click();
  await page.getByRole('textbox', { name: 'Description:' }).fill('This is a dummy description.');
  await page.getByRole('textbox', { name: 'Due Date:' }).fill('2025-04-18');
  await page.getByLabel('Course:').selectOption('67460db839c6b3085338aa81');
  await page.getByRole('button', { name: 'Save & Close' }).click();
  await page.getByRole('heading', { name: 'New Task Added:' }).click();
  await page.locator('span').filter({ hasText: 'Test Assignment #' }).click();
  await page.getByText('×').click();
  await page.getByRole('link', { name: 'task list icon' }).click();
  await page.getByText('Test Assignment #').click();
  await page.getByText('CSCE490 Test Assignment #').click();
  await page.getByText('×').click();
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.locator('app-task').filter({ hasText: 'CSCE490Test Assignment #' }).locator('a').nth(2).click();
});

test('test_classmate_navig', async ({ page }) => {
  await page.goto('http://localhost:4200/');
  await page.getByRole('button', { name: 'Go To Login' }).click();
  await page.getByRole('textbox', { name: 'Username:' }).click();
  await page.getByRole('textbox', { name: 'Username:' }).fill('admin');
  await page.getByRole('textbox', { name: 'Username:' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password:' }).fill('admin');
  await page.getByRole('textbox', { name: 'Password:' }).press('Enter');
  await page.getByRole('link', { name: 'grades icon' }).click();
  await page.getByText('ASSIGNMENT').click();
  await page.getByRole('img', { name: 'classmate icon' }).click();
  await page.getByText('COURSE').click();
});

test('test_wrong_password', async ({ page }) => {
  await page.goto('http://localhost:4200/');
  await page.getByRole('button', { name: 'Go To Login' }).click();
  await page.getByRole('textbox', { name: 'Username:' }).click();
  await page.getByRole('textbox', { name: 'Username:' }).fill('admin');
  await page.getByRole('textbox', { name: 'Password:' }).click();
  await page.getByRole('textbox', { name: 'Password:' }).fill('wrongpassword');
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'Login', exact: true }).click();
  await page.getByRole('heading', { name: 'LOGIN' }).click();
});