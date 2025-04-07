import { test, expect } from '@playwright/test';

test('test_check_task', async ({ page }) => {
  await page.goto('http://localhost:4200/');
  await page.getByRole('button', { name: 'Go To Login' }).click();
  await page.getByRole('textbox', { name: 'Username:' }).click();
  await page.getByRole('textbox', { name: 'Username:' }).fill('admin');
  await page.getByRole('textbox', { name: 'Username:' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password:' }).fill('admin');
  await page.getByRole('button', { name: 'Login', exact: true }).click();
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: '✔' }).click();
  await page.getByRole('checkbox').uncheck();
  await page.getByRole('button', { name: '✔' }).click();
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
  await page.locator('#grade').click();
  await page.locator('#grade').press('ArrowRight');
  await page.locator('#grade').fill('90');
  await page.locator('#grade').press('Enter');
  await page.getByText('A', { exact: true }).click();
  await page.locator('#grade').click();
  await page.getByText('A', { exact: true }).click();
  await page.locator('#grade').click();
  await page.locator('#grade').fill('80');
  await page.locator('#grade').press('Enter');
  await page.getByText('B').click();
  await page.locator('#grade').click();
  await page.locator('#grade').fill('70');
  await page.getByText('B').click();
  await page.getByText('C', { exact: true }).click();
  await page.getByText('C', { exact: true }).click();
  await page.locator('#grade').click();
  await page.locator('#grade').fill('60');
  await page.locator('#grade').press('Enter');
  await page.getByText('D', { exact: true }).click();
  await page.locator('#grade').click();
  await page.locator('#grade').fill('50');
  await page.locator('#grade').press('Enter');
  await page.getByText('F', { exact: true }).click();
  await page.getByRole('img', { name: 'calculator icon' }).click();
  await page.getByRole('button', { name: 'Add Assignment' }).click();
  await page.getByRole('row', { name: 'Remove', exact: true }).getByRole('button').click();
  await page.getByRole('row', { name: 'Homework Remove' }).getByRole('spinbutton').first().click();
  await page.getByRole('button', { name: 'Reset All' }).click();
  await page.getByText('×').click();
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
  await page.getByRole('textbox', { name: 'Preferred Name:' }).click();
  await page.getByText('Preferred Name:').click();
  await page.getByText('University Email:').click();
  await page.getByText('Current Password:').click();
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
  await page.getByText('CSCE492').click();
  await page.getByText('CSCE552').click();
  await page.getByText('CSCE490').click();
  await page.locator('app-task').getByText('CSCE490').click();
  await page.getByRole('heading', { name: 'Due Soon' }).click();
  await page.getByText('Admin New Asssignment 1 - Feb 26,').click();
  await page.getByText('- Feb 26,').click();
  await page.getByRole('img', { name: 'add task icon' }).click();
  await page.getByText('Title:').click();
  await page.getByRole('textbox', { name: 'Title:' }).click();
  await page.getByRole('textbox', { name: 'Title:' }).fill('Test');
  await page.getByRole('textbox', { name: 'Description:' }).click();
  await page.getByRole('textbox', { name: 'Description:' }).fill('test');
  await page.getByRole('textbox', { name: 'Due Date:' }).fill('2025-04-06');
  await page.getByLabel('Course:').selectOption('67460db839c6b3085338aa81');
  await page.getByRole('button', { name: 'Save & Close' }).click();
  await page.getByRole('heading', { name: 'New Task Added:' }).click();
  await page.getByText('CSCE490-J10-FALL-').click();
  await page.getByText('×').click();
  await page.getByText('CSCE490').nth(2).click();
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.locator('app-task').filter({ hasText: 'CSCE490TestApr 6,' }).locator('a').nth(2).click();
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