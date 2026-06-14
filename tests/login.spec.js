import { test, expect } from '@playwright/test';
test('Login Test Case', async ({ page }) => {
    await page.goto('https://adactinhotelapp.com/');
    await page.fill('#username', 'haristester01');
    await page.fill('#password', 'haristester01');
    await page.click('#login');
});