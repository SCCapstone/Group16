import { test, expect } from '@playwright/test';

test('test_check_task', async ({ page }) => {
  await page.goto('http://localhost:4200/');
  await page.getByRole('button', { name: 'Go To Login' }).click();
  await page.getByRole('textbox', { name: 'Username:' }).click();
  await page.getByRole('textbox', { name: 'Username:' }).fill('admin');
  await page.getByRole('textbox', { name: 'Username:' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password:' }).fill('admin');
  await page.getByRole('textbox', { name: 'Password:' }).press('Enter');
  await page.getByText('CSCE490').nth(1).click();
  await page.getByText('Test', { exact: true }).click();
  await page.getByText('CSCE490 Test Due: Apr 10,').click();
  await page.getByText('×').click();
  await page.locator('app-task').filter({ hasText: 'CSCE490TestApr 10,' }).getByRole('checkbox').check();
  await page.getByRole('button', { name: '✔' }).click();
  await page.locator('app-task').filter({ hasText: 'CSCE490TestApr 7,' }).getByRole('checkbox').uncheck();
  await page.getByRole('button', { name: '✔' }).click();
  await page.getByText('Test', { exact: true }).click();
  await page.getByText('CSCE490 Test Due: Apr 7, 2025').click();
  await page.getByText('×').click();
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
  await page.getByText('Test').first().click();
  await page.locator('div').filter({ hasText: /^CSCE490Test$/ }).locator('div').first().click();
  await page.locator('div').filter({ hasText: /^CSCE490Test$/ }).locator('#grade').click();
  await page.locator('div').filter({ hasText: /^CSCE490Test$/ }).locator('#grade').press('ArrowRight');
  await page.locator('div').filter({ hasText: /^CSCE490Test$/ }).locator('#grade').fill('100');
  await page.locator('div').filter({ hasText: /^CSCE490Test$/ }).locator('#grade').press('Enter');
  await page.getByText('A', { exact: true }).first().click();
  await page.locator('div').filter({ hasText: /^CSCE490Test$/ }).locator('#grade').click();
  await page.locator('div').filter({ hasText: /^CSCE490Test$/ }).locator('#grade').fill('90');
  await page.locator('div').filter({ hasText: /^CSCE490Test$/ }).locator('#grade').press('Enter');
  await page.getByText('A', { exact: true }).first().click();
  await page.locator('div').filter({ hasText: /^CSCE490Test$/ }).locator('#grade').click();
  await page.locator('div').filter({ hasText: /^CSCE490Test$/ }).locator('#grade').fill('80');
  await page.locator('div').filter({ hasText: /^CSCE490Test$/ }).locator('#grade').press('Enter');
  await page.getByText('B', { exact: true }).click();
  await page.locator('div').filter({ hasText: /^CSCE490Test$/ }).locator('#grade').click();
  await page.locator('div').filter({ hasText: /^CSCE490Test$/ }).locator('#grade').fill('70');
  await page.locator('div').filter({ hasText: /^CSCE490Test$/ }).locator('#grade').press('Enter');
  await page.getByText('C', { exact: true }).click();
  await page.locator('div').filter({ hasText: /^CSCE490Test$/ }).locator('#grade').click();
  await page.locator('div').filter({ hasText: /^CSCE490Test$/ }).locator('#grade').fill('60');
  await page.locator('div').filter({ hasText: /^CSCE490Test$/ }).locator('#grade').press('Enter');
  await page.getByText('D').nth(2).click();
  await page.locator('div').filter({ hasText: /^CSCE490Test$/ }).locator('#grade').click();
  await page.locator('div').filter({ hasText: /^CSCE490Test$/ }).locator('#grade').fill('50');
  await page.locator('div').filter({ hasText: /^CSCE490Test$/ }).locator('#grade').press('Enter');
  await page.getByText('F').nth(1).click();
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
  await page.getByRole('textbox', { name: 'Title:' }).fill('TEST ASSIGNMENT #123');
  await page.getByRole('textbox', { name: 'Description:' }).click();
  await page.getByRole('textbox', { name: 'Description:' }).fill('DELETE ME');
  await page.getByRole('textbox', { name: 'Due Date:' }).fill('0001-01-01');
  await page.getByRole('textbox', { name: 'Due Time:' }).click();
  await page.getByLabel('Course:').selectOption('67460db839c6b3085338aa81');
  await page.getByRole('button', { name: 'Save & Close' }).click();
  await page.getByRole('heading', { name: 'New Task Added:' }).click();
  await page.locator('span').filter({ hasText: 'TEST ASSIGNMENT #' }).click();
  await page.getByText('DELETE ME').click();
  await page.locator('app-add-task').getByText('Jan 1,').click();
  await page.getByText('CSCE490-J10-FALL-').click();
  await page.getByText('×').click();
  await page.getByText('CSCE490').nth(1).click();
  await page.getByText('TEST ASSIGNMENT #123', { exact: true }).click();
  await page.getByText('CSCE490 TEST ASSIGNMENT #123').click();
  await page.getByText('×').click();
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.locator('app-task').filter({ hasText: 'CSCE490TEST ASSIGNMENT #' }).locator('a').nth(2).click();
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