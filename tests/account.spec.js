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
});