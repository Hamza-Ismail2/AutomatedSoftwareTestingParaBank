import { test, expect } from '@playwright/test';
import BasePage from './BasePage';

export default class FindTransactionsPage extends BasePage {
  pageHeading;
  accountSelect;
  transactionIdInput;
  dateInput;
  dateFromInput;
  dateToInput;
  amountInput;
  resultsTable;

  constructor(page) {
    super(page);
    this.pageHeading = page.getByRole('heading', { name: 'Find Transactions', level: 1 });
    this.accountSelect = page.locator('#accountId');
    this.transactionIdInput = page.locator('#transactionId');
    this.dateInput = page.locator('#transactionDate');
    this.dateFromInput = page.locator('#fromDate');
    this.dateToInput = page.locator('#toDate');
    this.amountInput = page.locator('#amount');
    this.resultsTable = page.locator('#transactionTable');
  }

  async open() {
    await test.step('Open Find Transactions page', async () => {
      await this.navigate('/findtrans.htm');
      await expect(this.pageHeading).toBeVisible();
    });
  }

  async findByAmount(accountId, amount) {
    await test.step(`Find transactions by amount $${amount} in account ${accountId}`, async () => {
      await this.accountSelect.selectOption(accountId);
      await this.amountInput.fill(amount);
      await this.page.locator('#findByAmount').click();
    });
  }

  async findByDateRange(data) {
    await test.step(`Find transactions from ${data.dateRange.from} to ${data.dateRange.to}`, async () => {
      await this.accountSelect.selectOption(data.accountId);
      await this.dateFromInput.fill(data.dateRange.from);
      await this.dateToInput.fill(data.dateRange.to);
      await this.page.locator('#findByDateRange').click();
    });
  }

  async findByDate(accountId, date) {
    await test.step(`Find transactions by date ${date} in account ${accountId}`, async () => {
      await this.accountSelect.selectOption(accountId);
      await this.dateInput.fill(date);
      await this.page.locator('#findByDate').click();
    });
  }

  async verifyResultsDisplayed() {
    await test.step('Verify transaction search results are displayed', async () => {
      await expect(this.resultsTable).toBeVisible();
    });
  }

  async verifyFormVisible() {
    await test.step('Verify Find Transactions form controls', async () => {
      await expect(this.pageHeading).toBeVisible();
      await expect(this.accountSelect).toBeVisible();
      await expect(this.amountInput).toBeVisible();
      await expect(this.dateFromInput).toBeVisible();
    });
  }
}