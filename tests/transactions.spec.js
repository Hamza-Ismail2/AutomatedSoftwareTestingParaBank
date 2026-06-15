import { test, expect } from '../fixtures/testSetup.js';

test.describe('Movement of Funds & Searches', () => {
  test.beforeEach(async ({ authenticatedPage, sessionAccounts }) => {
    void authenticatedPage;
    void sessionAccounts;
  });

  test.afterEach(async ({ page, screenshotHelper }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      await screenshotHelper.captureOnFailure(page);
    }
  });

  test('should display Transfer Funds form with all controls', async ({ transferFundsPage, page, screenshotHelper }) => {
    await transferFundsPage.open();
    await transferFundsPage.verifyFormVisible();
    await screenshotHelper.captureStep(page, { name: 'transfer-form' });
  });

  test('should transfer funds successfully between accounts', async ({
    transferFundsPage,
    sessionAccounts,
    page,
    screenshotHelper,
  }) => {
    const transferData = {
      amount: '10',
      fromAccount: sessionAccounts.primaryAccount,
      toAccount: sessionAccounts.secondaryAccount,
    };
    await transferFundsPage.open();
    await transferFundsPage.transferFunds(transferData);
    await transferFundsPage.verifyTransferSuccess();
    await expect(transferFundsPage.resultMessage).toContainText(transferData.amount);
    await screenshotHelper.captureStep(page, { name: 'transfer-success' });
  });

  test('should remain on transfer page when amount is empty', async ({
    transferFundsPage,
    sessionAccounts,
    page,
    screenshotHelper,
  }) => {
    await transferFundsPage.open();
    await transferFundsPage.submitEmptyAmountTransfer(
      sessionAccounts.primaryAccount,
      sessionAccounts.secondaryAccount
    );
    await expect(transferFundsPage.pageHeading).toBeVisible();
    await expect(transferFundsPage.resultMessage).not.toBeVisible();
    await screenshotHelper.captureStep(page, { name: 'transfer-empty-amount' });
  });

  test('should find transactions by amount', async ({
    findTransactionsPage,
    sessionAccounts,
    page,
    screenshotHelper,
  }) => {
    await findTransactionsPage.open();
    await findTransactionsPage.verifyFormVisible();
    await findTransactionsPage.findByAmount(sessionAccounts.accountId, '10');
    await findTransactionsPage.verifyResultsDisplayed();
    await screenshotHelper.captureStep(page, { name: 'find-by-amount' });
  });

  test('should find transactions by date range', async ({
    findTransactionsPage,
    sessionAccounts,
    testData,
    page,
    screenshotHelper,
  }) => {
    const searchData = {
      accountId: sessionAccounts.accountId,
      dateRange: testData.findTransactions.dateRange,
    };
    await findTransactionsPage.open();
    await findTransactionsPage.findByDateRange(searchData);
    await findTransactionsPage.verifyResultsDisplayed();
    await screenshotHelper.captureStep(page, { name: 'find-by-date-range' });
  });

  test('should complete transfer using alternate account pair', async ({
    transferFundsPage,
    sessionAccounts,
    page,
    screenshotHelper,
  }) => {
    const altTransfer = {
      amount: '5',
      fromAccount: sessionAccounts.secondaryAccount,
      toAccount: sessionAccounts.primaryAccount,
    };
    await transferFundsPage.open();
    await transferFundsPage.transferFunds(altTransfer);
    await transferFundsPage.verifyTransferSuccess();
    await screenshotHelper.captureStep(page, { name: 'alternate-transfer-success' });
  });

  test('should find transactions by single date', async ({
    findTransactionsPage,
    sessionAccounts,
    testData,
    page,
    screenshotHelper,
  }) => {
    await findTransactionsPage.open();
    await findTransactionsPage.findByDate(sessionAccounts.accountId, testData.findTransactions.byDate);
    await findTransactionsPage.verifyResultsDisplayed();
    await screenshotHelper.captureStep(page, { name: 'find-by-single-date' });
  });
});
