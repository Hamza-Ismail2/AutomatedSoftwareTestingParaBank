import { test as base, expect } from '@playwright/test';
import LoginPage from '../pages/LoginPage.js';
import AccountOverviewPage from '../pages/AccountOverviewPage.js';
import OpenAccountPage from '../pages/OpenAccountPage.js';
import TransferFundsPage from '../pages/TransferFundsPage.js';
import BillPayPage from '../pages/BillPayPage.js';
import FindTransactionsPage from '../pages/FindTransactionPage.js';
import ContactPage from '../pages/ContactPage.js';
import AccountActivityPage from '../pages/AccountActivityPage.js';
import SiteNavigationPage from '../pages/SiteNavigationPage.js';
import RequestLoanPage from '../pages/RequestLoanPage.js';
import AboutPage from '../pages/AboutPage.js';
import { createScreenshotHelper } from '../utilities/screenshot.js';
import { data } from '../utilities/dataParser.js';
import { logger } from '../utilities/logger.js';
import { establishAuthenticatedSession, isAuthenticated, registerFreshUser } from '../utilities/authHelper.js';

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

  accountActivityPage: async ({ page }, use) => {
    await use(new AccountActivityPage(page));
  },

  siteNavigationPage: async ({ page }, use) => {
    await use(new SiteNavigationPage(page));
  },

  requestLoanPage: async ({ page }, use) => {
    await use(new RequestLoanPage(page));
  },

  aboutPage: async ({ page }, use) => {
    await use(new AboutPage(page));
  },

  screenshotHelper: async ({}, use, testInfo) => {
    const helper = createScreenshotHelper(testInfo);
    await use(helper);
  },

  authenticatedPage: async ({ page, loginPage, testData: td }, use) => {
    const session = await establishAuthenticatedSession(page, loginPage, td);
    await expect(loginPage.getWelcomeMessage()).toContainText(session.fullName, { timeout: 15000 });
    await use(loginPage);
  },

  sessionAccounts: async ({ authenticatedPage, accountOverviewPage, openAccountPage }, use) => {
    void authenticatedPage;
    await accountOverviewPage.open();
    await accountOverviewPage.verifyAccountsTableVisible();
    let accountIds = await accountOverviewPage.getAccountIds();

    if (accountIds.length < 2 && accountIds.length > 0) {
      await openAccountPage.open();
      const fundOptionCount = await openAccountPage.fundFromAccountSelect.locator('option').count();
      if (fundOptionCount > 0) {
        await openAccountPage.openNewAccount({
          accountType: 'CHECKING',
          fundFromAccount: accountIds[0],
        });
        const newAccountId = await openAccountPage.verifyAccountOpenedSuccessfully();
        if (newAccountId && !accountIds.includes(newAccountId)) {
          accountIds.push(newAccountId);
        }
        await accountOverviewPage.open();
        accountIds = await accountOverviewPage.getAccountIds();
      }
    }

    if (accountIds.length === 0) {
      throw new Error('No accounts were found for the authenticated ParaBank session.');
    }

    await use({
      primaryAccount: accountIds[0],
      secondaryAccount: accountIds[1] ?? accountIds[0],
      accountId: accountIds[0],
    });
  },
});

export async function performLogin(loginPage, credentials) {
  await loginPage.open();
  await loginPage.login(credentials);
}

export { expect };
