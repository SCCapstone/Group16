import { test, expect } from '@playwright/test';

test('example_behavioral_test', async ({ page }) => {
  await page.goto('http://localhost:4200/');
  await page.getByRole('button', { name: 'Go To Login' }).click();
  await page.getByRole('textbox', { name: 'Username:' }).click();
  await page.getByRole('textbox', { name: 'Username:' }).fill('osterholt');
  await page.getByRole('textbox', { name: 'Password:' }).click();
  await page.getByRole('textbox', { name: 'Password:' }).fill('wrongpassword');
  await page.getByRole('button', { name: 'Login', exact: true }).click();
  await expect(page.getByText('Login failed, please try again')).toBeVisible();
});

test('test_login', async ({ page }) => {
  await page.goto('http://localhost:4200/');
  await page.getByRole('button', { name: 'Go To Login' }).click();
  await page.getByRole('textbox', { name: 'Username:' }).click();
  await page.getByRole('textbox', { name: 'Username:' }).fill('osterholt');
  await page.getByRole('textbox', { name: 'Password:' }).click();
  await page.getByRole('textbox', { name: 'Password:' }).fill('cameron1234');
  await page.getByRole('button', { name: 'Login', exact: true }).click();
  await expect(page).toHaveURL(/\/main$/);
});

test('test_click_around', async ({ page }) => {
  await page.goto('http://localhost:4200/');
  await page.getByRole('button', { name: 'Go To Login' }).click();
  await page.getByRole('button', { name: 'Auto-Login' }).click();
  await page.locator('app-task').filter({ hasText: 'CSCE546Mar 24 MeetingMar 31,' }).getByRole('checkbox').check();
  await page.locator('app-task').filter({ hasText: 'CSCE546Mar 24 MeetingMar 31,' }).getByRole('checkbox').uncheck();
  await page.getByRole('link', { name: 'calendar icon' }).click();
  await page.getByText('THURSDAY').click();
  await page.getByRole('link', { name: 'grades icon' }).click();
  await page.getByText('COURSE').click();
  await page.getByRole('img', { name: 'add task icon' }).click();
  await page.getByText('Title:').click();
  await page.getByText('×').click();
  await page.getByRole('img', { name: 'calculator icon' }).click();
  await page.getByRole('cell', { name: 'Assignment Label' }).click();
  await page.getByRole('button', { name: 'Reset All' }).click();
  await page.getByText('×').click();
  await page.getByRole('link', { name: 'settings icon' }).click();
  await page.getByText('Preferred Name:').click();
  await page.getByText('Appearance').click();
  await page.getByText('Notifications').click();
  await page.getByText('Text Messages').click();
  await page.getByRole('checkbox', { name: 'Text Messages' }).uncheck();
  await page.getByText('Sign Out').click();
  await page.getByRole('button', { name: 'Back to Main Page' }).click();
  await page.locator('header a').nth(1).click();
  await page.getByText('×').click();
  await page.getByRole('heading', { name: 'Due Soon' }).click();
  await page.getByRole('img', { name: 'classmate icon' }).click();
});