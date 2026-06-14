import { test, expect } from '../fixtures/testSetup';

test.describe('Account Balances & Overview', () => {
  test.beforeEach(async ({ authenticatedPage, accountOverviewPage }) => {
    void authenticatedPage;
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

  test('should display account numbers and balances in the table', async ({ accountOverviewPage, page, screenshotHelper }) => {
    await accountOverviewPage.verifyAccountsTableVisible();
    await expect(accountOverviewPage.getAccountBalance('54321')).toContainText('$');
    await screenshotHelper.captureStep(page, { name: 'account-balances' });
  });

  test('should display total balance summary row', async ({ accountOverviewPage, page, screenshotHelper }) => {
    await accountOverviewPage.verifyTotalBalanceDisplayed();
    await screenshotHelper.captureStep(page, { name: 'total-balance' });
  });

  test('should open a new CHECKING account successfully', async ({ openAccountPage, testData, page, screenshotHelper }) => {
    const accountData = testData.openAccount[0];
    await openAccountPage.open();
    await openAccountPage.verifyFormVisible();
    await openAccountPage.openNewAccount(accountData);
    const newAccountId = await openAccountPage.verifyAccountOpenedSuccessfully();
    expect(newAccountId).toMatch(/^\d+$/);
    await screenshotHelper.captureStep(page, { name: 'account-opened' });
  });

  test('should open a new SAVINGS account successfully', async ({ openAccountPage, testData, page, screenshotHelper }) => {
    const savingsData = testData.openAccount[1];
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
    testData,
    page,
    screenshotHelper,
  }) => {
    await accountActivityPage.openForAccount(testData.findTransactions.accountId);
    await accountActivityPage.expectActivityTablePopulated();
    await screenshotHelper.captureStep(page, { name: 'account-activity' });
  });

  test('should include account id in activity page URL', async ({ accountActivityPage, testData, page }) => {
    const accountId = testData.findTransactions.accountId;
    await accountActivityPage.openForAccount(accountId);
    expect(page.url()).toContain(`id=${accountId}`);
  });

  test('should set browser title to Accounts Overview on overview page', async ({ accountOverviewPage, page }) => {
    await accountOverviewPage.open();
    await expect(page).toHaveTitle(/Accounts Overview/i);
  });
});

