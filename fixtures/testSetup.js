import { test as base, expect } from '@playwright/test';
import LoginPage from '../pages/LoginPage';
import AccountOverviewPage from '../pages/AccountOverviewPage';
import OpenAccountPage from '../pages/OpenAccountPage';
import TransferFundsPage from '../pages/TransferPage';
import BillPayPage from '../pages/BillPayPage';
import FindTransactionsPage from '../pages/FindTransactionPage';
import ContactPage from '../pages/ContactPage';
import { createScreenshotHelper } from '../utilities/screenshot';
import { data } from '../utilities/dataParser';
import { logger } from '../utilities/logger';

/**
 * Custom test fixture extending Playwright's base execution context with
 * pre-initialized page objects, external test data, and screenshot hooks.
 */
export const test = base.extend({
  testData: async ({}, use) => {
    await use(data);
  },

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  accountOverviewPage: async ({ page }, use) => {
    await use(new AccountOverviewPage(page));
  },

  openAccountPage: async ({ page }, use) => {
    await use(new OpenAccountPage(page));
  },

  transferFundsPage: async ({ page }, use) => {
    await use(new TransferFundsPage(page));
  },

  billPayPage: async ({ page }, use) => {
    await use(new BillPayPage(page));
  },

  findTransactionsPage: async ({ page }, use) => {
    await use(new FindTransactionsPage(page));
  },

  contactPage: async ({ page }, use) => {
    await use(new ContactPage(page));
  },

  screenshotHelper: async ({}, use, testInfo) => {
    const helper = createScreenshotHelper(testInfo);
    await use(helper);
  },

  /**
   * Provides a pre-authenticated session using the default valid user from testData.json.
   */
  authenticatedPage: async ({ page, loginPage, testData: td }, use) => {
    await loginPage.open();
    await loginPage.login(td.validUser);
    await expect(page.getByText(`Welcome ${td.validUser.fullName}`)).toBeVisible();
    logger.info(`Authenticated as ${td.validUser.username}`, 'testSetup');
    await use(loginPage);
  },
});

/**
 * Performs a login using arbitrary credentials — utility for auth test scenarios.
 * @param loginPage - LoginPage instance bound to the active browser tab.
 * @param credentials - Username and password to authenticate with.
 */
export async function performLogin(loginPage, credentials) {
  await loginPage.open();
  await loginPage.login(credentials);
}

export { expect };