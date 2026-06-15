import { test, expect } from '../fixtures/testSetup.js';

test.describe('Account Balances & Overview', () => {
  test.beforeEach(async ({ authenticatedPage, accountOverviewPage, sessionAccounts }) => {
    void authenticatedPage;
    void sessionAccounts;
    await accountOverviewPage.open();
  });

  test.afterEach(async ({ page, screenshotHelper }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      await screenshotHelper.captureOnFailure(page);
    }
  });

  test('should display Accounts Overview page after login', async ({ accountOverviewPage, testData, page, screenshotHelper }) => {
    await accountOverviewPage.verifyWelcomeMessage(testData.validUser.fullName);
    await expect(accountOverviewPage.overviewHeading).toBeVisible();
    await screenshotHelper.captureStep(page, { name: 'accounts-overview' });
  });

  test('should display account numbers and balances in the table', async ({
    accountOverviewPage,
    sessionAccounts,
    page,
    screenshotHelper,
  }) => {
    await accountOverviewPage.verifyAccountsTableVisible();
    await expect(accountOverviewPage.getAccountBalance(sessionAccounts.primaryAccount)).toContainText('$');
    await screenshotHelper.captureStep(page, { name: 'account-balances' });
  });

  test('should display total balance summary row', async ({ accountOverviewPage, page, screenshotHelper }) => {
    await accountOverviewPage.verifyTotalBalanceDisplayed();
    await screenshotHelper.captureStep(page, { name: 'total-balance' });
  });

  test('should open a new CHECKING account successfully', async ({
    openAccountPage,
    sessionAccounts,
    page,
    screenshotHelper,
  }) => {
    const accountData = { accountType: 'CHECKING', fundFromAccount: sessionAccounts.primaryAccount };
    await openAccountPage.open();
    await openAccountPage.verifyFormVisible();
    await openAccountPage.openNewAccount(accountData);
    const newAccountId = await openAccountPage.verifyAccountOpenedSuccessfully();
    expect(newAccountId).toMatch(/^\d+$/);
    await screenshotHelper.captureStep(page, { name: 'account-opened' });
  });

  test('should open a new SAVINGS account successfully', async ({
    openAccountPage,
    sessionAccounts,
    page,
    screenshotHelper,
  }) => {
    const savingsData = { accountType: 'SAVINGS', fundFromAccount: sessionAccounts.primaryAccount };
    await openAccountPage.open();
    await openAccountPage.openNewAccount(savingsData);
    const accountId = await openAccountPage.verifyAccountOpenedSuccessfully();
    expect(accountId.length).toBeGreaterThan(0);
    await screenshotHelper.captureStep(page, { name: 'savings-account-opened' });
  });

  test('should navigate to Accounts Overview via sidebar link', async ({ accountOverviewPage }) => {
    await accountOverviewPage.navigateViaSidebar();
    await expect(accountOverviewPage.overviewHeading).toBeVisible();
  });

  test('should display transaction rows on account activity page', async ({
    accountActivityPage,
    sessionAccounts,
    page,
    screenshotHelper,
  }) => {
    await accountActivityPage.openForAccount(sessionAccounts.accountId);
    await accountActivityPage.expectActivityTablePopulated();
    await screenshotHelper.captureStep(page, { name: 'account-activity' });
  });

  test('should include account id in activity page URL', async ({ accountActivityPage, sessionAccounts, page }) => {
    const accountId = sessionAccounts.accountId;
    await accountActivityPage.openForAccount(accountId);
    expect(page.url()).toContain(`id=${accountId}`);
  });

  test('should set browser title to Accounts Overview on overview page', async ({ accountOverviewPage, page }) => {
    await accountOverviewPage.open();
    await expect(page).toHaveTitle(/Accounts Overview/i);
  });
});
