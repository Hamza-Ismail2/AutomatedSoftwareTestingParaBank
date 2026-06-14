import { test, expect } from '../fixtures/testSetup';

test.describe('Movement of Funds & Searches', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    void authenticatedPage;
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

  test('should transfer funds successfully between accounts', async ({ transferFundsPage, testData, page, screenshotHelper }) => {
    const transferData = testData.transferFunds[0];
    await transferFundsPage.open();
    await transferFundsPage.transferFunds(transferData);
    await transferFundsPage.verifyTransferSuccess();
    await expect(transferFundsPage.resultMessage).toContainText(transferData.amount);
    await screenshotHelper.captureStep(page, { name: 'transfer-success' });
  });

  test('should remain on transfer page when amount is empty', async ({ transferFundsPage, testData, page, screenshotHelper }) => {
    const transferData = testData.transferFunds[0];
    await transferFundsPage.open();
    await transferFundsPage.submitEmptyAmountTransfer(transferData.fromAccount, transferData.toAccount);
    await expect(transferFundsPage.pageHeading).toBeVisible();
    await expect(transferFundsPage.resultMessage).not.toBeVisible();
    await screenshotHelper.captureStep(page, { name: 'transfer-empty-amount' });
  });

  test('should find transactions by amount', async ({ findTransactionsPage, testData, page, screenshotHelper }) => {
    const { accountId, byAmount } = testData.findTransactions;
    await findTransactionsPage.open();
    await findTransactionsPage.verifyFormVisible();
    await findTransactionsPage.findByAmount(accountId, byAmount);
    await findTransactionsPage.verifyResultsDisplayed();
    await screenshotHelper.captureStep(page, { name: 'find-by-amount' });
  });

  test('should find transactions by date range', async ({ findTransactionsPage, testData, page, screenshotHelper }) => {
    await findTransactionsPage.open();
    await findTransactionsPage.findByDateRange(testData.findTransactions);
    await findTransactionsPage.verifyResultsDisplayed();
    await screenshotHelper.captureStep(page, { name: 'find-by-date-range' });
  });

  test('should complete transfer using alternate account pair', async ({ transferFundsPage, testData, page, screenshotHelper }) => {
    const altTransfer = testData.transferFunds[1];
    await transferFundsPage.open();
    await transferFundsPage.transferFunds(altTransfer);
    await transferFundsPage.verifyTransferSuccess();
    await screenshotHelper.captureStep(page, { name: 'alternate-transfer-success' });
  });

  test('should find transactions by single date', async ({ findTransactionsPage, testData, page, screenshotHelper }) => {
    const { accountId, byDate } = testData.findTransactions;
    await findTransactionsPage.open();
    await findTransactionsPage.findByDate(accountId, byDate);
    await findTransactionsPage.verifyResultsDisplayed();
    await screenshotHelper.captureStep(page, { name: 'find-by-single-date' });
  });
});