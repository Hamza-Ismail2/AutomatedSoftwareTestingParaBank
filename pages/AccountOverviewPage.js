import { test, expect } from '@playwright/test';
import BasePage from './BasePage';
import { logger } from '../utilities/logger';

export default class AccountOverviewPage extends BasePage {
  overviewHeading;
  accountsTable;
  totalBalanceRow;

  constructor(page) {
    super(page);
    this.overviewHeading = page.getByRole('heading', { name: 'Accounts Overview', level: 1 });
    this.accountsTable = page.locator('#accountTable');
    this.totalBalanceRow = page.locator('#accountTable tbody tr').filter({ hasText: 'Total' });
  }

  async open() {
    await test.step('Open Accounts Overview page', async () => {
      await this.navigate('/overview.htm');
      await expect(this.overviewHeading).toBeVisible();
    });
  }

  async navigateViaSidebar() {
    await test.step('Navigate to Accounts Overview via sidebar', async () => {
      await this.clickAccountServiceLink('Accounts Overview');
      await expect(this.overviewHeading).toBeVisible();
    });
  }

  async verifyWelcomeMessage(fullName) {
    await test.step(`Verify welcome message for ${fullName}`, async () => {
      await expect(this.getWelcomeMessage()).toContainText(fullName);
    });
  }

  async verifyAccountsTableVisible() {
    await test.step('Verify accounts table is visible with data', async () => {
      await expect(this.accountsTable).toBeVisible();
      const accountRows = this.accountsTable.locator('tbody tr').filter({ hasNotText: 'Total' });
      await expect(accountRows.first()).toBeVisible();
      const rowCount = await accountRows.count();
      logger.info(`Account rows found: ${rowCount}`, 'AccountOverviewPage');
      expect(rowCount).toBeGreaterThan(0);
    });
  }

  async verifyTotalBalanceDisplayed() {
    await test.step('Verify total balance row is displayed', async () => {
      await expect(this.totalBalanceRow).toBeVisible();
      await expect(this.totalBalanceRow.locator('td').nth(1)).toContainText('$');
    });
  }

  async openAccountActivity(accountId) {
    await test.step(`Open activity for account ${accountId}`, async () => {
      await this.accountsTable.getByRole('link', { name: accountId, exact: true }).click();
      await expect(this.page.getByRole('heading', { name: 'Account Activity' })).toBeVisible();
    });
  }

  getAccountBalance(accountId) {
    return this.accountsTable.locator('tbody tr').filter({ hasText: accountId }).locator('td').nth(1);
  }
}