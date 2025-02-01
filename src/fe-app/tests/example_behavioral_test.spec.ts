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