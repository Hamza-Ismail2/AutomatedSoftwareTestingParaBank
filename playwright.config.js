import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

if (!process.env.PLAYWRIGHT_BROWSERS_PATH && process.platform === 'win32') {
  process.env.PLAYWRIGHT_BROWSERS_PATH = path.join(os.homedir(), 'AppData', 'Local', 'ms-playwright');
}

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  timeout: 60_000,
  expect: { timeout: 15_000 },
  reporter: [
    ['list'],
    [
      'allure-playwright',
      {
        resultsDir: path.join(__dirname, 'allure-results'),
        detail: true,
        suiteTitle: true,
      },
    ],
  ],
  use: {
    baseURL: 'https://parabank.parasoft.com/parabank/',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },
  outputDir: path.join(__dirname, 'test-results'),
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
